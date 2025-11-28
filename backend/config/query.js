const pool = require("./db");

async function query(sql, params = []) {
  try {
    const [rows] = await pool.query(sql, params);
    return rows;
  } catch (err) {
    console.error("Database query error:", err.message);
    throw err;
  }
}

module.exports = { query };
