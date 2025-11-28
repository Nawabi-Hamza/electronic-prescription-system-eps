const mysql = require("mysql2");
require("dotenv").config();

// Detect number of cluster workers (if clustering)
const WORKERS = process.env.CLUSTER_WORKERS || 1;

// Set safe connection limit
// Example: 15 per worker → 8 workers = 120 total
const PER_WORKER_POOL = process.env.DB_POOL || 15;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: PER_WORKER_POOL,
  queueLimit: 0
});

// Test connection once
pool.getConnection((err, connection) => {
  if (err) {
    console.error(
      "❌ Database connection failed!",
      err.code || err.message
    );
    process.exit(1);
  }
  console.log(
    `🔌 DB Connected | Pool Limit Per Worker: ${PER_WORKER_POOL}`
  );
  connection.release();
});

module.exports = pool.promise();
