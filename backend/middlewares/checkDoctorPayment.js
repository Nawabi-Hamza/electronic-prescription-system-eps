const { query } = require("../config/query")


const checkDoctorPayment = async (req, res, next) => {
  try {
    const doctorId = req.user.id;  // from auth token

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1 to 12

    const rows = await query(
      `SELECT * FROM doctor_payments 
       WHERE doctor_id = ? AND year_pay = ? AND month_number = ? AND is_paid = 1`,
      [doctorId, currentYear, currentMonth]
    );

    if (rows.length === 0) {
      return res.status(402).json({
        status: false,
        message: "Your subscription for this month is unpaid. Please complete your payment.",
      });
    }

    next();

  } catch (err) {
    console.error("Payment Check Error:", err);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};


module.exports = { checkDoctorPayment }