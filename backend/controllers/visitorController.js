const { query } = require("../config/query")
const { getOrSetCache } = require("../middlewares/cache");

const getDoctors = async (req, res) => {
    try {
        const doctors = await getOrSetCache('doctors-list-visitors', async () => {
            const result = await query(`SELECT id, clinic_name as clinic, doctor_name as name, lastname, photo, clinic_fee as fee
                    FROM doctors
                    WHERE status = 'active'
                    ORDER BY created_at 
                `);
            return result;
        }, 60); // cache for 60 seconds

        res.json({ data: doctors });
    } catch (err) {
        console.error('Error fetching doctors:', err);
        res.status(500).json({ message: 'Server error fetching doctors' });
    }
};



const createVisitAppointment = async (req, res) => {
  try {
    const { doctor_id, patient_name, age, phone, description = "" } = req.body;

    // ---------------------------------------
    // 1. Validate inputs
    // ---------------------------------------
    if (!doctor_id)
      return res.status(400).json({ message: "Doctor ID is required" });

    if (!patient_name || patient_name.length < 3)
      return res.status(400).json({ message: "Valid patient name required" });

    if (!age || age < 0 || age > 120)
      return res.status(400).json({ message: "Invalid age" });

    if (!phone || !/^[0-9]{10,14}$/.test(phone))
      return res.status(400).json({ message: "Invalid phone number" });

    // ---------------------------------------
    // 2. Generate daily visit number
    // ---------------------------------------
    const today = new Date().toISOString().slice(0, 10);

    const [row] = await query(
      `
      SELECT COUNT(*) AS count
      FROM visits
      WHERE doctors_id = ?
      AND DATE(created_at) = ?
    `,
      [doctor_id, today]
    );
    console.log(row)
    const visit_number = row.count + 1;

    // ---------------------------------------
    // 3. Insert appointment
    // ---------------------------------------
    const result = await query(
      `
      INSERT INTO visits
      (patient_name, age, phone, description, visit_number, doctors_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      [patient_name, age, phone, description, visit_number, doctor_id]
    );

    const insertedId = result.insertId;

    // ---------------------------------------
    // 4. Return saved data
    // ---------------------------------------
    const [saved] = await query(`SELECT * FROM visits WHERE id = ?`, [
      insertedId,
    ]);

    return res.status(201).json({
      message: "Appointment created successfully",
      visit: saved,
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      message: "Server error while creating appointment",
      error: err.message,
    });
  }
};



module.exports = {
    getDoctors,
    createVisitAppointment
}