const { query } = require("../config/query")
const { getOrSetCache, invalidateKey } = require("../middlewares/cache");

const getDoctors = async (req, res) => {
    try {
        const doctors = await getOrSetCache('doctors-list-visitors', async () => {
            const result = await query(`SELECT id, clinic_name as clinic, doctor_name as name, lastname, photo, clinic_fee as fee
                    FROM doctors
                    ORDER BY created_at DESC
                `);
            return result;
        }, 60); // cache for 60 seconds

        res.json({ data: doctors });
    } catch (err) {
        console.error('Error fetching doctors:', err);
        res.status(500).json({ message: 'Server error fetching doctors' });
    }
};


const getDoctorTiming = async (req, res) => {
  const doctor_id = req.params.id;
  if (!doctor_id) return res.send("Doctor is required!");

  try {
    
    const doctorRows = await query(`SELECT id, status FROM doctors WHERE id = ? LIMIT 1`, [doctor_id]);
    if (doctorRows.length === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    const doctor = doctorRows[0];
    if (doctor.status !== "active") {
      return res.status(404).json({
        error: "Doctor is not active"
      });
    }
    
    const cacheKey = "doctor_timing_today_" + doctor_id;
    const result = await getOrSetCache(
      cacheKey,
      async () => {
        const today = new Date()
          .toLocaleString("en-US", { weekday: "long" })
          .toLowerCase();

        // 1) Doctor's schedule for today
        const rows = await query(
          `SELECT id, day_of_week, slot_duration, max_patients_per_slot,
                  DATE_FORMAT(in_time, '%H:%i') AS in_time,
                  DATE_FORMAT(out_time, '%H:%i') AS out_time,
                  status
           FROM available_days
           WHERE doctors_id = ? AND day_of_week = ?`,
          [doctor_id, today]
        );
 
        if (rows.length === 0) {
          return {
            day: today,
            status: "close",
            in_time: null,
            out_time: null,
            slot_duration: null,
            max_patients_per_slot: null,
            total_slots: 0,
            total_possible_patients: 0,
            total_booked_patients: 0,
            taken_numbers: [],
            next_available_number: 1
          };
        }

        const d = rows[0];

        const timeToMinutes = (t) => {
          const [h, m] = t.split(":");
          return parseInt(h) * 60 + parseInt(m);
        };

        // 2) Fetch all visits today — get visit_number list
        const visits = await query(
          `SELECT visit_number 
           FROM visits 
           WHERE doctors_id = ? AND DATE(created_at) = CURDATE()
           ORDER BY visit_number ASC`,
          [doctor_id]
        );

        const takenNumbers = visits.map(v => v.visit_number);
        const totalBooked = takenNumbers.length;

        // 3) Calculate total slots
        const inMin = timeToMinutes(d.in_time);
        const outMin = timeToMinutes(d.out_time);

        const diff = outMin >= inMin
          ? outMin - inMin
          : outMin + 1440 - inMin;

        const totalSlots = Math.floor(diff / d.slot_duration);
        const totalPossiblePatients =
          totalSlots * d.max_patients_per_slot;

        // 4) Calculate next available number
        const nextAvailable =
          takenNumbers.length === 0
            ? 1
            : Math.max(...takenNumbers) + 1;

        return {
          day: today,
          status: d.status,
          in_time: d.in_time,
          out_time: d.out_time,
          slot_duration: d.slot_duration,
          max_patients_per_slot: d.max_patients_per_slot,

          total_slots: totalSlots,
          total_possible_patients: totalPossiblePatients,

          total_booked_patients: totalBooked,

          // ⭐ NEW
          taken_numbers: takenNumbers,
          next_available_number: nextAvailable
        };
      },

      60
    );

    return res.json({
      from: "db/cache",
      today: result
    });

  } catch (err) {
    console.error("ROUTE ERROR:", err);
    res.status(500).send("Database error");
  }
};


const createVisitAppointment = async (req, res) => {
  try {
    let { doctors_id, patient_name, age, phone, message = "", device_id } = req.body;

    // -----------------------------
    // 1️⃣ Validation
    // -----------------------------
    if (!doctors_id) return res.status(400).json({ message: "Doctor ID required" });

    if (!patient_name || patient_name.length < 3)
      return res.status(400).json({ message: "Valid full name required" });

    if (!age || age < 0 || age > 120) return res.status(400).json({ message: "Invalid age" });

    if (!phone || !/^[0-9]{10,14}$/.test(phone))
      return res.status(400).json({ message: "Invalid phone number" });

    if (!device_id) return res.status(400).json({ message: "Device ID required" });

    // -----------------------------
    // 2️⃣ IP detection
    // -----------------------------
    const visitor_ip =
      req.headers["x-forwarded-for"] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.ip ||
      "unknown";

    // -----------------------------
    // 3️⃣ Prevent same device from booking twice today
    // -----------------------------
    const today = new Date().toISOString().slice(0, 10);

    const [existingVisit] = await query(
      `SELECT visit_number FROM visits
       WHERE doctors_id = ? AND device_id = ? AND DATE(created_at) = ?`,
      [doctors_id, device_id, today]
    );

    if (existingVisit) {
      return res.status(400).json({
        message: "You have already booked a visit today to this doctor",
        visit_number: existingVisit.visit_number,
        allow_new_visit: false,
      });
    }

    // -----------------------------
    // 4️⃣ Generate next available visit_number
    // -----------------------------
    const takenNumbers = await query(
      `SELECT visit_number FROM visits
       WHERE doctors_id = ? AND DATE(created_at) = ? ORDER BY visit_number ASC`,
      [doctors_id, today]
    );

    let nextNumber = 1;
    for (const row of takenNumbers) {
      if (row.visit_number === nextNumber) nextNumber++;
      else break;
    }

    // -----------------------------
    // 5️⃣ Insert visit
    // -----------------------------
    const result = await query(
      `INSERT INTO visits
       (patient_name, age, phone, description, visit_number, doctors_id, device_id, ip_address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [patient_name, age, phone, message, nextNumber, doctors_id, device_id, visitor_ip]
    );

    const insertedId = result.insertId;

    const [saved] = await query(`SELECT * FROM visits WHERE id = ?`, [insertedId]);

    invalidateKey("client_appointment_today_" + device_id)

    return res.status(201).json({
      message: "Appointment created successfully",
      visit: saved,
      visit_number: nextNumber,
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      message: "Server error while creating appointment",
      error: err.message,
    });
  }
};


const getUserAppointments = async (req, res) => {
  try {
    const { device_id } = req.params;

    if (!device_id) {
      return res.status(400).json({ message: "Device ID required" });
    }

    const visitor_ip =
      req.headers["x-forwarded-for"] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.ip ||
      "unknown";

    const cacheKey = `client_appointment_today_${device_id}`;

    const appointments = await getOrSetCache(cacheKey, async () => {
      // 1️⃣ Fetch all pending appointments for this device
      const userAppointments = await query(
        `SELECT 
           v.id,
           v.visit_number,
           v.patient_name,
           v.phone,
           v.status,
           v.created_at,
           v.doctors_id,
           CONCAT(d.doctor_name, ' ', d.lastname) as doctor_name,
           d.photo AS doctor_photo,
           d.clinic_name
         FROM visits v
         LEFT JOIN doctors d ON v.doctors_id = d.id
         WHERE v.device_id = ? AND v.status = 'pending' AND DATE(v.visit_date) = CURDATE()
         ORDER BY v.created_at DESC`,
        [device_id]
      );

      if (userAppointments.length === 0) return [];

      // 2️⃣ Get all unique doctor IDs in one query
      const doctorIds = [...new Set(userAppointments.map(a => a.doctors_id))];

      // 3️⃣ Fetch latest visited patient per doctor today
      const latestPatients = await query(
        `SELECT v.doctors_id, v.patient_name, v.visit_number
         FROM visits v
         JOIN (
           SELECT doctors_id, MAX(created_at) as last_visit
           FROM visits
           WHERE DATE(created_at) = CURDATE() AND status='visited'
           GROUP BY doctors_id
         ) latest ON v.doctors_id = latest.doctors_id AND v.created_at = latest.last_visit`
      );

      const latestMap = {};
      latestPatients.forEach(lp => {
        latestMap[lp.doctors_id] = {
          patient_name: lp.patient_name,
          visit_number: lp.visit_number
        };
      });

      // 4️⃣ Combine latest patient info with user appointments
      return userAppointments.map(appt => ({
        ...appt,
        latest_patient: latestMap[appt.doctors_id] || null,
        visitor_ip // include visitor IP for debugging/tracking
      }));
    }, 60); // cache for 60 seconds

    return res.status(200).json({
      from: "db/cache",
      message: "Appointments fetched",
      appointments
    });

  } catch (err) {
    console.error("Error fetching appointments:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};



module.exports = {
    getDoctors,
    createVisitAppointment,
    getDoctorTiming,
    getUserAppointments
}