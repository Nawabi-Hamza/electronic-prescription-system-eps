const { query } = require("../config/query");


const logger = (req, res, next) => {
  const time = new Date().toLocaleTimeString();
  console.log(`[${time}] ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  next();
};


async function logDoctorAction({ action, table, doctorId }) {
  await query(
    `INSERT INTO logger (action, table_access, user_id) VALUES (?, ?, ?)`,
    [action, table, doctorId]
  );
}


module.exports = { 
  logger,
  logDoctorAction,
};
