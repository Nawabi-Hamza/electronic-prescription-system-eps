// utils/dateUtils.js
const jalaali = require("jalaali-js");


function toShamsi(date) {
  const d = date instanceof Date ? date : new Date(date);
  const { jy, jm, jd } = jalaali.toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
  const hh = d.getHours();
  const mm = d.getMinutes();
  return {
    jy, jm, jd,
    hh, mm,
    toString(format = "YYYY-MM-DD HH:mm") {
      const pad = (n) => String(n).padStart(2, "0");
      if (format === "YYYY-MM-DD") return `${jy}-${pad(jm)}-${pad(jd)}`;
      if (format === "YYYY-MM-DD HH:mm") return `${jy}-${pad(jm)}-${pad(jd)} ${pad(hh)}:${pad(mm)}`;
      return `${jy}-${pad(jm)}-${pad(jd)} ${pad(hh)}:${pad(mm)}`;
    }
  };
}

function fromShamsi(shamsiStr) {
  const [datePart, timePart = "00:00"] = shamsiStr.split(" ");
  const [jy, jm, jd] = datePart.split("-").map(Number);
  const [hh = 0, mm = 0] = timePart.split(":").map(Number);
  const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
  // JS Date month is 0-based
  return new Date(gy, gm - 1, gd, hh || 0, mm || 0);
}

function fromShamsiYear(shamsiStr) {
  const [datePart, timePart = "00:00"] = shamsiStr.split(" ");
  const [jy, jm, jd] = datePart.split("-").map(Number);
  const [hh = 0, mm = 0] = timePart.split(":").map(Number);
  const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
  // JS Date month is 0-based
  return new Date(gy, gm - 1, gd, hh || 0, mm || 0);
}

const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().split("T")[0];
};


function getStartEndDate(shamsiDate) {
  let jy, jm;

  if (!shamsiDate) {
    // if no date is passed → use today
    const today = new Date();
    const j = jalaali.toJalaali(today.getFullYear(), today.getMonth() + 1, today.getDate());
    jy = j.jy;
    jm = j.jm;
  } else {
    // use the given shamsi date
    jy = Number(shamsiDate.year);
    jm = Number(shamsiDate.month);
  }

  // first & last day of this Shamsi month
  const firstDay = 1;
  const lastDay = jalaali.jalaaliMonthLength(jy, jm);

  // convert to Gregorian
  const gStart = jalaali.toGregorian(jy, jm, firstDay);
  const gEnd   = jalaali.toGregorian(jy, jm, lastDay);

  // build proper JS Dates
  const startDate = new Date(gStart.gy, gStart.gm - 1, gStart.gd, 0, 0, 0, 0);
  const endDate   = new Date(gEnd.gy,   gEnd.gm - 1,   gEnd.gd, 23, 59, 59, 999);

  return { startDate, endDate };
}

function getShamsiMonthDays(input) {
  let year, month;

  if (input instanceof Date) {
    // If input is a JS Date
    const { jy, jm } = jalaali.toJalaali(input);
    year = jy;
    month = jm;
  } else if (typeof input === "string") {
    // If input is like "1402-3"
    [year, month] = input.split("-").map(Number);
  } else if (typeof input === "object" && input.year && input.month) {
    // If input is an object { year, month }
    ({ year, month } = input);
  } else {
    throw new Error("Invalid input for Shamsi month days");
  }

  return jalaali.jalaaliMonthLength(year, month);
}

// ✅ Examples:

// 1. Direct year/month
// console.log(getShamsiMonthDays({ year: 1402, month: 3 })); // 31

// 2. Date object
// console.log(getShamsiMonthDays(new Date())); // e.g., 30 or 31 depending on current Shamsi month

// 3. String input
// console.log(getShamsiMonthDays("1402-12")); // 29 or 30 depending on leap year







module.exports = { 
    toShamsi,
    fromShamsi,
    fromShamsiYear, 
    formatDate,
    getStartEndDate,
    getShamsiMonthDays
};
