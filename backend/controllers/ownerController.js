const { query } = require("../config/query")
const { getOrSetCache, invalidateKey } = require("../middlewares/cache");
const bcrypt = require("bcryptjs");


const cache_doctor_list = "doctors_list"
let cache_single_doctor = "doctor_list_item_"

const getNextUserCode = async () => {
  const year = new Date().getFullYear().toString().slice(-2); // "25"
  const prefix = `D-${year}-`;

  // Query max existing number for this year
  const rows = await query(
    `SELECT MAX(CAST(SUBSTRING(generated_id, LENGTH(?) + 1) AS UNSIGNED)) AS maxNumber
     FROM doctors
     WHERE generated_id LIKE ?`,
    [prefix, `${prefix}%`]
  );

  const maxNumber = rows[0].maxNumber || 0;
  const nextNumber = (maxNumber + 1).toString().padStart(4, '0'); // zero-pad to 3 digits

  return `${prefix}${nextNumber}`; // e.g. "25-001"
};


const showAllDoctors = async (req, res) => {
  try {
    const result = await getOrSetCache(
      cache_doctor_list,
      async () => {
        return await query(
          `SELECT id, generated_id, clinic_name, doctor_name, phone, email,
                  experience_year, photo, calendar_type, status  
           FROM doctors
           ORDER BY id DESC`
        );
      },
      60 // cache for 60 seconds
    );

    return res.json({
      from: "db/cache",
      records: result,
    });

  } catch (err) {
    console.error("ROUTE ERROR:", err);
    res.status(500).send("Database error");
  }
};


const showSingleDoctors = async (req, res) => {
  try {
    const { user_id } = req.params;
    const cacheKey = cache_single_doctor+user_id;

    // ------ 1️⃣ USE CACHE HELPER HERE -------------
    const result = await getOrSetCache(
      cacheKey,
      async () => {
        // 🔥 If cache is empty this function runs

        // Fetch doctor
        const [doctor] = await query(
          `SELECT id, generated_id, clinic_name, doctor_name, phone, date_of_birth,
                  prescription_logo, gender, clinic_fee, email, experience_year,
                  photo, calendar_type, status, created_at as join_date, updated_at
           FROM doctors WHERE id = ?`,
          [user_id]
        );

        if (!doctor) return null;

        // Fetch other tables in parallel (faster)
        const [specializations, addresses, available_days] = await Promise.all([
          query(`SELECT * FROM specializations WHERE doctors_id = ?`, [user_id]),
          query(`SELECT * FROM addresses WHERE doctors_id = ?`, [user_id]),
          query(`SELECT * FROM available_days WHERE doctors_id = ?`, [user_id]),
        ]);

        return {
          ...doctor,
          specializations,
          addresses,
          available_days,
        };
      },
      60 // cache for 60 seconds
    );

    if (!result) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({
      from: "db/cache",
      record: result,
    });

  } catch (err) {
    console.error("ROUTE ERROR:", err);
    res.status(500).send("Database error");
  }
};


const addNewDoctor = async(req, res) => {
    try {
    const ownerId = req.user.id
    if(!ownerId) return res.status(400).json({ message: "Invalid Cridential for create user"})

    const { doctor_name, clinic_name, lastname, phone, email, password, date_of_birth, experience_year, gender, calendar_type, status, clinic_fee } = req.body;

    // Check if email already exists
    const existingUsers = await query('SELECT id FROM doctors WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Generate user_code
    const user_code = await getNextUserCode();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    let photoname = "";
    if(req.file){
      photoname = req?.file?.filename
    }

    // Insert user
    const sql = `INSERT INTO doctors 
      (generated_id, clinic_name, doctor_name, lastname, phone, email, password, date_of_birth, experience_year, photo, gender, calendar_type, status, clinic_fee, owner_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [user_code, clinic_name, doctor_name,lastname, phone, email, hashedPassword, date_of_birth, experience_year, photoname, gender, calendar_type,status, clinic_fee, ownerId ];

    const result = await query(sql, params);
    invalidateKey(cache_doctor_list)
    
    res.status(201).json({ message: 'User registered successfully', user_id: result.insertId, user_code });
  } catch (error) {
    console.error('Register user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
    showAllDoctors,
    showSingleDoctors,
    addNewDoctor
}