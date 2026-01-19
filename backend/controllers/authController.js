
require('dotenv').config();
const path = require('path');
const { query } = require('../config/query'); // ✅ use your shared query helper
const { generateToken } = require('../middlewares/jwt');
const bcrypt = require("bcryptjs");
const fs = require("fs");
const redis = require("../config/redis");
const { logDoctorAction } = require('../middlewares/logger');

// const newOwner = {
//   name: "Hamza Nawabi",
//   email: "hamza.nawabi119@gmail.com",
//   status: "active",
//   password: "admin123"
// }

// async function abc(){
//   try{
//     const hashedPassword = await bcrypt.hash(newOwner.password, 10);
//     await query("INSERT INTO owner (full_name, email, password, status) VALUES (?,?,?,?)", [newOwner.name, newOwner.email, hashedPassword,newOwner.status])
//   }catch(err){
//     console.log(err)
//   }
// }
// abc()

// START LOGIN
const ownerlogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [results] = await query(`SELECT id, full_name, email, photo, status, password FROM owners WHERE email = ?`, [email]);

    const user = results;
    if (!user) return res.status(404).json({ message: '📧Invalid email or password' });
    if (user.status !== 'active') return res.status(404).json({ message: 'Account is deactivated or deleted' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(404).json({ message: '🔑Invalid email or password' });

    const token = generateToken({
      id: user.id,
      role: 'owner',
      email: user.email
    });

    res.json({ success: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database error', error: err });
  }
};

const clientLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [results] = await query(`SELECT id, doctor_name, lastname, CONCAT(doctor_name, " ", lastname) as full_name  , email, photo, status, password FROM doctors WHERE email = ?`, [email]);

    const user = results;
    if (!user) return res.status(404).json({ message: '📧Invalid email or password' });
    if (user.status !== 'active') return res.status(404).json({ message: 'Account is deactivated or deleted' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(404).json({ message: '🔑Invalid email or password' });

    await logDoctorAction({ action: 'LOGIN', table: 'doctors', doctorId: user.id });

    const token = generateToken({
      id: user.id,
      role: 'doctor',
      email: user.email
    });

    res.json({ success: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database error', error: err });
  }
};
// END LOGIN


// ✅ UPDATE PASSWORD
const updatePassword = async (req, res) => {
  try {
    const { currentPassowrd, newPassword } = req.body;
    const loggedInUserId = req?.user?.id;
    if (!loggedInUserId) return res.status(401).json({ message: 'Unauthorized: No user info' });
    // Owner Update Password
    if(req.user.role == "owner"){
      const [results] = await query(`SELECT id, full_name, password FROM owners WHERE id = ? AND status = 'active'`, [loggedInUserId]);
      if (results.length === 0) return res.status(404).json({ message: "User not found or deleted" });
  
      const isMatch = await bcrypt.compare(currentPassowrd, results.password);
      if (!isMatch) return res.status(404).json({ message: '🔑 Invalid current password' });
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await query("UPDATE owners SET password = ? WHERE id = ?", [hashedPassword, loggedInUserId]);
      res.status(201).json({ message: 'Password Updated successfully' });
    }
    // Doctor Update Password
    else if(req.user.role == "doctor"){
      const [results] = await query(`SELECT id, CONCAT(doctor_name," ", lastname) AS full_name, password FROM doctors WHERE id = ? AND status = 'active'`, [loggedInUserId]);
      if (results.length === 0) return res.status(404).json({ message: "User not found or deleted" });
  
      const isMatch = await bcrypt.compare(currentPassowrd, results.password);
      if (!isMatch) return res.status(404).json({ message: '🔑 Invalid current password' });
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await query("UPDATE doctors SET password = ? WHERE id = ?", [hashedPassword, loggedInUserId]);
      await logDoctorAction({ action: 'UPDATE_PASSWORD', table: 'doctors', doctorId: loggedInUserId });

      res.status(201).json({ message: 'Password Updated successfully' });

    }
    else{
      res.status(401).json({ message: "Invalid Credentials Role With This User"})
    }

  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ UPDATE PROFILE PICTURE
const updateProfilePicture = async (req, res) => {
  try {
    // return console.log(req.user)
    const loggedInUserId = req?.user?.id;
    const loggedInUserRole = req.user.role;
    if (!loggedInUserId) return res.status(401).json({ message: 'Unauthorized: No user info' });
    // Update OWNER Profile Picture
    if(loggedInUserRole == "owner"){
        const [results] = await query(`SELECT id, photo, created_at FROM owners WHERE id = ? AND status = 'active'`, [loggedInUserId]);
        if (results.length === 0) return res.status(404).json({ message: "User not found or deleted" });
        const existingUser = results;

        if (existingUser.photo) {
          const oldProfilePath = path.join(process.cwd(), "uploads", 'profiles', existingUser.photo);
          if (fs.existsSync(oldProfilePath)) fs.unlinkSync(oldProfilePath);
        }
    
        const profilePic = req.file?.filename;
        await query("UPDATE owners SET photo = ? WHERE id = ?", [profilePic, loggedInUserId]);
    
        res.status(201).json({ message: 'Profile picture updated successfully', photo: profilePic });

    }
    // Update DOCTOR Profile Picture
    else if(loggedInUserRole == "doctor"){
      const results = await query(`SELECT id, photo FROM doctors WHERE id = ? AND status = 'active'`, [loggedInUserId]);
      if (results.length === 0) return res.status(404).json({ message: "User not found or deleted" });
  
      const existingUser = results[0];
      if (existingUser.photo) {
        const oldProfilePath = path.join(process.cwd(), "uploads", 'profiles', existingUser.photo);
        if (fs.existsSync(oldProfilePath)) fs.unlinkSync(oldProfilePath);
      }
  
      const profilePic = req.file.filename;
      await query("UPDATE doctors SET photo = ? WHERE id = ?", [profilePic, loggedInUserId]);
      await logDoctorAction({ action: 'UPDATE_PROFILE', table: 'doctors', doctorId: loggedInUserId });
  
      res.status(201).json({ message: 'Profile picture updated successfully', photo: profilePic });
    }
    else{
      res.status(401).json({ message: "Invalid Credentials Role With This User"})
    }
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// START GET USER INFO FROM TOKEN 
const getUserFromTokenOwner = async(req, res) => {
  
  try {
    const userId = req?.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized: No user ID found in token" });
    
    // 1️⃣ Check Redis Cache First
    const cacheKey = "owner-from-token-"+userId;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.json({ from: "redis", data: JSON.parse(cached) });
    }else{
      const [results] = await query(`SELECT id, full_name, photo, email, status, created_at FROM owners WHERE id = ? AND status != 'deleted'`, [userId]);
      if (results.length === 0) return res.status(404).json({ message: "Owner not found or deleted" });
      results.role = 'owner';

      await redis.setEx(cacheKey, 30, JSON.stringify(results));   //set for 60 second in cache  
      
  
      res.json({ from: "db", data: results});
    }

  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

const getUserFromTokenClient = async(req, res) => {
  
  try {
    const userId = req?.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized: No user ID found in token" });
    
    // 1️⃣ Check Redis Cache First
    const cacheKey = "client-from-token-"+userId;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.json({ from: "redis", data: JSON.parse(cached) });
    }else{
    const [results] = await query(`SELECT id, generated_id, clinic_name, doctor_name, lastname, CONCAT(doctor_name, " ", lastname) AS full_name , photo, prescription_logo, clinic_fee, calendar_type, created_at as join_date, phone, email, status, created_at FROM doctors WHERE id = ? AND status != 'deleted'`, [userId]);
      if (!results) return res.status(404).json({ message: "Client not found or deleted" });
      results.role = 'doctor';

      await redis.setEx(cacheKey, 30, JSON.stringify(results));   //set for 60 second in cache  
      
  
      res.json({ from: "db", data: results});
    }

  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// END GET USER INFO FROM TOKEN 



module.exports = {
  ownerlogin,
  clientLogin,
  getUserFromTokenOwner,
  getUserFromTokenClient,
  updatePassword,
  updateProfilePicture,
};

