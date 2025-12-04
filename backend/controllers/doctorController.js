const { query } = require("../config/query")
const redis = require("../config/redis");
const { getOrSetCache, invalidateKey } = require("../middlewares/cache");
const bcrypt = require("bcryptjs");
const fs = require("fs")
const path = require("path")


const getAllDetailsOfDoctor = async (req, res) => {
  const doctor_id = req.user.id;

  try {
    const cacheKey = "doctor_list_details_" + doctor_id;

    const result = await getOrSetCache(
      cacheKey,
      async () => {

        // 1️⃣ Get doctor main info
        const doctor = await query(`SELECT id, generated_id, clinic_name, doctor_name, lastname, status FROM doctors WHERE id = ?`, [doctor_id]);
        if (!doctor.length) return null;
        const doc = doctor[0];
        // 2️⃣ Get addresses
        const addresses = await query(`SELECT id, type, country, province AS city, district, room_number, floor_number, address, status FROM addresses WHERE doctors_id = ?`, [doctor_id]);
        // 3️⃣ Get specializations
        const specializations = await query(`SELECT id, specialization_name AS name, specialization_description AS description, status FROM specializations WHERE doctors_id = ?`, [doctor_id]);
        // 4️⃣ Get available days
        const available_days = await query(`SELECT id, saturday, sunday, monday, tuesday, wednesday, thursday, friday, in_time, out_time FROM available_days WHERE doctors_id = ?`, [doctor_id]);
        // 5️⃣ Combine all results into one object
        return {
          ...doc,
          addresses,
          specializations,
          available_days,
        };
      },
      60 // cache 60 seconds
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

// IF CLIENT DID PAYMENT THIS MONT THIS MESSAGE WILL SEND HIM
const paymentDone = async(req, res) => {
    return res.json({
        status: true,
        message: "Your subscription for this month is paid."
    });
}

// START AVAILABLE TIMING CONTROLLER
const updateTiming = async (req, res) => {
  const doctor_id = req.user.id;

  const { saturday, sunday, monday, tuesday, wednesday, thursday, friday, in_time, out_time } = req.body;

  try {

    // Check if timing exists
    const check = await query(
      `SELECT id FROM available_days WHERE doctors_id = ?`,
      [doctor_id]
    );

    // If not exists -> INSERT
    if (check.length === 0) {
      await query(
        `INSERT INTO available_days 
          (doctors_id, saturday, sunday, monday, tuesday, wednesday, thursday, friday, in_time, out_time)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [ doctor_id, saturday, sunday, monday, tuesday, wednesday, thursday, friday, in_time, out_time ]
      );
    }

    // If exists -> UPDATE
    else {
      await query(
        `UPDATE available_days 
            SET saturday = ?, sunday = ?, monday = ?, tuesday = ?, wednesday = ?, thursday = ?, friday = ?, in_time = ?, out_time = ?
        WHERE doctors_id = ?`,
        [ saturday, sunday, monday, tuesday, wednesday, thursday, friday, in_time, out_time, doctor_id ]
      );
    }

    // Return updated timing
    const updated = await query(`SELECT * FROM available_days WHERE doctors_id = ?`, [doctor_id]);

    invalidateKey("doctor_list_details_" + doctor_id)

    res.json({
      success: true,
      message: "Timing updated successfully",
      timing: updated[0]
    });

  } catch (error) {
    console.error("UPDATE TIMING ERROR:", error);
    res.status(500).json({ error: "Database error" });
  }
};
// END AVAILABLE TIMING CONTROLLER

// START SPECIALIZATION CONTROLLER
const addSpecialization = async (req, res) => {
  try {
    const doctorId = req.user.id;  // assuming doctor is logged in
    const { name, description, status } = req.body;

    if (!name) {
      return res.status(400).json({
        status: false,
        message: "Specialization name is required",
      });
    }

    // 1. Check existing count
    const [rows] = await query(`SELECT COUNT(*) AS total FROM specializations WHERE doctors_id = ?`, [doctorId]);
    if (rows.total >= 5) {
      return res.status(400).json({
        status: false,
        message: "You cannot add more than 5 specializations.",
      });
    }

    // 2. Insert new specialization
    const save = await query(
      `INSERT INTO specializations (doctors_id, specialization_name, specialization_description, status)
       VALUES (?, ?, ?, ?)`,
      [doctorId, name, description || "", status]
    );

    // 3. Remove cache for this doctor
    await invalidateKey(`users-from-token-${doctorId}`);  // if user profile cache exists

    return res.status(201).json({
      status: true,
      message: "Specialization added successfully",
      insertedId: save.insertId
    });

  } catch (err) {
    console.error("Add Specialization Error:", err);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

const deleteSpecialization = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { id } = req.params; // specialization id

    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Specialization ID is required",
      });
    }

    // 1. Check if specialization exists and belongs to this doctor
    const [record] = await query(
      `SELECT id FROM specializations WHERE id = ? AND doctors_id = ?`,
      [id, doctorId]
    );


    if (!record) {
      return res.status(404).json({
        status: false,
        message: "Specialization not found or access denied",
      });
    }

    // 2. Delete specialization
    await query(
      `DELETE FROM specializations WHERE id = ? AND doctors_id = ?`,
      [id, doctorId]
    );

    // 3. Invalidate user-related cache
    await invalidateKey(`users-from-token-${doctorId}`);  // if user profile cache exists


    return res.status(200).json({
      status: true,
      message: "Specialization deleted successfully",

    });

  } catch (err) {
    console.error("Delete Specialization Error:", err);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};
// END SPECIALIZATION CONTROLLER

// START ADDRESS CONTROLLER
const addAddress = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { type, country, province, district, address, floor_number, room_number, status = 'active' } = req.body;

    // Validate required fields
    if (!type || !country || !province || !district || !address) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields: type, country, province, district, address"
      });
    }

    // 1. Check existing count
    const [rows] = await query(
      `SELECT COUNT(*) AS total FROM addresses WHERE doctors_id = ?`,
      [doctorId]
    );

    if (rows.total >= 3) {
      return res.status(400).json({
        status: false,
        message: "You cannot add more than 3 addresses.",
      });
    }

    // 2. Insert new address
    const save = await query(
      `INSERT INTO addresses 
        (doctors_id, type, country, province, district, address, floor_number, room_number, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [ doctorId, type, country, province, district, address, floor_number || null, room_number || null, status ]
    );

    // 3. Invalidate doctor details cache
    // Your doctor list/details cache uses: doctor_list_details_<doctorId>
    await invalidateKey(`doctor_list_details_${doctorId}`);

    return res.status(201).json({
      status: true,
      message: "Address added successfully",
      insertedId: save.insertId
    });

  } catch (err) {
    console.error("Add Address Error:", err);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { id } = req.params; // address id

    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Address ID is required",
      });
    }

    // 1. Check if address exists and belongs to this doctor
    const [record] = await query(
      `SELECT id FROM addresses WHERE id = ? AND doctors_id = ?`,
      [id, doctorId]
    );

    if (!record) {
      return res.status(404).json({
        status: false,
        message: "Address not found or access denied",
      });
    }

    // 2. Delete address
    await query(
      `DELETE FROM addresses WHERE id = ? AND doctors_id = ?`,
      [id, doctorId]
    );

    // 3. Invalidate doctor detail cache
    await invalidateKey(`doctor_list_details_${doctorId}`);

    return res.status(200).json({
      status: true,
      message: "Address deleted successfully",
    });

  } catch (err) {
    console.error("Delete Address Error:", err);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};
// END ADDRESS CONTROLLER

// START MEDICINE CONTROLLER
const addMedicine = async (req, res) => {
  try {
    const doctorId = req.user.id ;  // If added by doctor, else null (system admin)
    const { name, brand_name, form, strength, category, description, side_effects, interactions, is_common } = req.body;

    // -------------------------
    // 1. Basic validation
    // -------------------------
    if (!name || !form) {
      return res.status(400).json({
        status: false,
        message: "Medicine name and form are required."
      });
    }

    // -------------------------
    // 2. Check duplicates for doctor-based medicines
    // -------------------------
    if (doctorId) {
      const exists = await query(
        `SELECT id FROM medicines 
         WHERE name = ? AND form = ? AND doctors_id = ?`,
        [name, form, doctorId]
      );

      console.log(exists)

      if (exists.length > 0) {
        return res.status(409).json({
          status: false,
          message: "This medicine already exists in your list."
        });
      }
    }

    // -------------------------
    // 3. Insert into database
    // -------------------------
    const result = await query(
      `INSERT INTO medicines 
      (name, brand_name, form, strength, category, description, side_effects, interactions, doctors_id, is_common)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        brand_name || null,
        form,
        strength || null,
        category || null,
        description || null,
        side_effects || null,
        interactions || null,
        doctorId,                // null for common medicines
        is_common ? 1 : 0
      ]
    );

    return res.status(201).json({
      status: true,
      message: "Medicine added successfully!",
      medicine_id: result.insertId
    });

  } catch (error) {
    console.error("Add Medicine Error:", error);
    return res.status(500).json({
      status: false,
      message: "Server error while adding medicine."
    });
  }
};

const getAllMedicine = async (req, res) => {
  const doctor_id = req.user.id;

  try {
    const cacheKey = "doctor_list_medicine_" + doctor_id;

    const result = await getOrSetCache(
      cacheKey,
      async () => {
        // 1️⃣ Get doctor main info
        return await query(`SELECT id, name, brand_name, form, strength, category, description, side_effects, interactions, is_common FROM medicines WHERE doctors_id = ?`, [doctor_id]);
      },
      60 // cache 60 seconds
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

const deleteMedicine = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { id } = req.params; // address id

    if (!id) {
      return res.status(400).json({
        status: false,
        message: "Address ID is required",
      });
    }

    // 1. Check if address exists and belongs to this doctor
    const [record] = await query(`SELECT id FROM medicines WHERE id = ? AND doctors_id = ?`, [id, doctorId]);

    if (!record) {
      return res.status(404).json({
        status: false,
        message: "Medicine not found or access denied",
      });
    }

    // 2. Delete address
    await query(`DELETE FROM medicines WHERE id = ? AND doctors_id = ?`, [id, doctorId]);

    // 3. Invalidate doctor detail cache
    await invalidateKey(`doctor_list_medicine_${doctorId}`);

    return res.status(200).json({
      status: true,
      message: "Medicine deleted successfully",
    });

  } catch (err) {
    console.error("Delete medicine Error:", err);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};
// END MEDICINE CONTROLLER

// START PAYMENT CONTROLLER
const getAllPaymentsOfDoctor = async (req, res) => {
  try {
    const doctor_id = req.user.id;

    if (!doctor_id) {
      return res.status(400).json({
        status: false,
        message: "Doctor ID is required"
      });
    }

    // 1️⃣ Get all years the doctor has payment records
    const yearSql = `SELECT DISTINCT year_pay FROM doctor_payments WHERE doctor_id = ? ORDER BY year_pay ASC;`;
    const years = await query(yearSql, [doctor_id]);

    if (years.length === 0) {
      return res.json({
        status: true,
        doctor_id,
        payments: {},
        message: "No payments found for this doctor."
      });
    }

    const monthsList = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ];

    const result = {};

    // 2️⃣ Loop through each year and get monthly payments
    for (const y of years) {
      const sql = `
        SELECT 
          month_number,
          SUM(amount) AS total_amount,
          MAX(is_paid) AS is_paid,
          MAX(paid_at) AS paid_at
        FROM doctor_payments
        WHERE doctor_id = ?
          AND year_pay = ?
        GROUP BY month_number
        ORDER BY month_number ASC;
      `;

      const rows = await query(sql, [doctor_id, y.year_pay]);

      // Build 12-month structure per year
      result[y.year_pay] = monthsList.map((name, i) => {
        const found = rows.find(r => r.month_number === i + 1);

        return {
          month_number: i + 1,
          month_name: name,
          total_amount: found ? Number(found.total_amount) : 0,
          is_paid: found ? Boolean(found.is_paid) : false,
          paid_at: found?.paid_at || null
        };
      });
    }

    return res.json({
      status: true,
      doctor_id,
      payments: result
    });

  } catch (error) {
    console.error("GET PAYMENTS ERROR:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to fetch doctor payments"
    });
  }
};
// END PAYMENT CONTROLLER

// START PRESCRIPTION HEADER
const logoUploadMethod = async(req ,res)=>{
      try {
        console.log(req.file)
        if(req.file){
          photoname = req?.file?.filename
          return res.status(201).json({ message: 'Logo uploaded successfully', logo_name: req.file.filename  });
        }
        return res.status(200).json({ message: "Please check your image"})
      } catch (error) {
        console.error('Logo upload error:', error);
        res.status(500).json({ message: 'Server error' });
      }

}

const savePrescriptionHeader = async (req, res) => {
  try {
    const doctorId = req.user.id;   
    const { name_prefex, address_id, registration_number, description, template_design } = req.body;
      await query(
        `INSERT INTO prescription_header
          (doctors_id, name_prefex, address_id, registration_number, template_design, description)
          VALUES (?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            name_prefex = VALUES(name_prefex),
            address_id = VALUES(address_id),
            registration_number = VALUES(registration_number),
            template_design = VALUES(template_design),
            description = VALUES(description)`,
        [ doctorId, name_prefex, address_id, registration_number, template_design, description ]
      );

    return res.json({
      status: true,
      message: "Prescription header saved successfully"
    });

  } catch (error) {
    console.error("HEADER ERROR:", error);
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message
    });
  }
};

const getPrescriptionHeader = async (req, res) => {
  try {
    const doctorId = req.user.id;

    // --- Get header + doctor basic info ---
    const [header] = await query(
      `
      SELECT       
        d.doctor_name, d.lastname, d.phone,
        d.clinic_name ,
        ph.id AS ph_id, ph.name_prefex, clinic_logo, signature_logo, address_id, registration_number, description, template_design
      FROM doctors d
      LEFT JOIN prescription_header ph ON d.id = ph.doctors_id
      WHERE d.id = ?
      `,
      [doctorId]
    );

    // --- Get doctor addresses ---
    const addresses = await query(`SELECT * FROM addresses WHERE doctors_id = ?`, [ doctorId ]);

    return res.json({
      status: true,
      data: {
        ...header,
        addresses: addresses || []
      }
    });

  } catch (error) {
    console.error("GET HEADER ERROR:", error);
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message
    });
  }
};

const updateClinicLogo = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const filename = req.file?.filename;

    if (!filename) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Check if doctor already has a prescription header row
    const [existing] = await query(
      `SELECT id FROM prescription_header WHERE doctors_id = ?`,
      [doctorId]
    );

    if (existing) {
      // Update existing record
      await query(`UPDATE prescription_header SET clinic_logo = ? WHERE doctors_id = ?`,[filename, doctorId]);
    } else {
      // Insert new record
      await query(`INSERT INTO prescription_header (doctors_id, name_prefex, clinic_logo, template_design) VALUES (?, ?, ? ,?)`,[doctorId, 'Dr.', filename, 'simple']);
    }

    res.json({
      message: "Clinic logo updated successfully!",
      filename: filename,
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating clinic logo" });
  }
};


const deleteFileIfExists = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("Deleted old file:", filePath);
    }
  } catch (err) {
    console.error("Error deleting old file:", err);
  }
};

const updateSignature = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const filename = req.file?.filename;

    if (!filename) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Get old signature of doctor
    const [existing] = await query(
      `SELECT id, signature_logo FROM prescription_header WHERE doctors_id = ?`,
      [doctorId]
    );
    console.log(existing)
    if (existing) {
      // DELETE OLD FILE (if exists)
      if (existing.signature_logo) {
        const oldFilePath = path.join(
          "uploads/doctor_signatures/",
          existing.signature_logo
        );
        deleteFileIfExists(oldFilePath);
      }

      // UPDATE NEW FILE
      await query(
        `UPDATE prescription_header SET signature_logo = ? WHERE doctors_id = ?`,
        [filename, doctorId]
      );
    } else {
      // INSERT NEW
      await query(
        `INSERT INTO prescription_header (doctors_id, name_prefex, signature_logo, template_design)
         VALUES (?, ?, ?, ?)`,
        [doctorId, "Dr.", filename, "simple"]
      );
    }

    res.json({
      message: "Signature updated successfully!",
      filename: filename,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating signature" });
  }
};



// END PRESCRIPTION HEADER
module.exports = {
    getAllDetailsOfDoctor,
    updateTiming,
    addSpecialization,
    deleteSpecialization,
    addAddress,
    deleteAddress,
    paymentDone,
    addMedicine,
    getAllMedicine,
    deleteMedicine,
    getAllPaymentsOfDoctor,
    savePrescriptionHeader,
    getPrescriptionHeader,
    logoUploadMethod,
    updateClinicLogo,
    updateSignature
}