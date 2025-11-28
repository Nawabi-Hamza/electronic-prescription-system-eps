import React, { useEffect, useState } from 'react'
import jalaali from "jalaali-js";
import { clockStyle } from '../styles/dashboardStyles';


export default function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000); // update every second
    return () => clearInterval(timer);
  }, []);

  // Format time with AM/PM
  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // <-- this adds AM/PM
  });

  // Gregorian date
  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Convert to Shamsi (Jalali) date
  const j = jalaali.toJalaali(time);
  const shamsiDate = `${j.jy}/${j.jm.toString().padStart(2, "0")}/${j.jd
    .toString()
    .padStart(2, "0")}`;

  return (
    <div className={clockStyle.container}>
      <div>
        <div className={clockStyle.time}>{formattedTime}</div>
        <div className={clockStyle.date}>{formattedDate}</div>
      </div>
      <div className={clockStyle.shamsiDate}>
        {shamsiDate} (هجری شمسی)
      </div>
    </div>
  );
}

export function FormatToShamsi(dateStr) {
  if (!dateStr) return "-";

  const date = new Date(dateStr);
  const { jy, jm, jd } = jalaali.toJalaali(date);

  const days = [
    "یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه", "شنبه"
  ];
  const dayName = days[date.getDay()]; // getDay: 0 = Sunday

  return `${dayName} ${jy}/${jm.toString().padStart(2, "0")}/${jd.toString().padStart(2, "0")}`;
}

export function FormatToShamsiDate(dateStr) {
  if (!dateStr) return "-";

  const date = new Date(dateStr);
  const { jy, jm, jd } = jalaali.toJalaali(date);

  

  return `${jy}/${jm.toString().padStart(2, "0")}/${jd.toString().padStart(2, "0")}`;
}

export function FormatToShamsiMonth(dateStr) {
  if (!dateStr) return "-";
  
  const date = new Date(dateStr);
  const { jy, jm } = jalaali.toJalaali(date); // only year & month
  
  return `${jy}-${jm.toString().padStart(2, "0")}`; // "YYYY-MM"
}

export function FormatToAmPm(timeStr) {
  if (!timeStr) return "-"; // handle null or empty

  const [hoursStr, minutesStr] = timeStr.split(":");
  if (hoursStr === undefined || minutesStr === undefined) return "-";

  let hours = parseInt(hoursStr, 10);
  const minutes = minutesStr.padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // convert 0 → 12
  const hoursDisplay = hours.toString().padStart(2, "0");

  return `${hoursDisplay}:${minutes} ${ampm}`;
}

export function ToShamsi(gregorianDate) {
  const [gy, gm, gd] = gregorianDate.split('-').map(Number);
  const { jy, jm, jd } = jalaali.toJalaali(gy, gm, gd);
  // return in YYYY-MM-DD format
  return `${jy.toString().padStart(4,'0')}-${jm.toString().padStart(2,'0')}-${jd.toString().padStart(2,'0')}`;
}


export function FormatLastLogin(isoDate) {
    if (!isoDate) return "Never logged in"; // handle null
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const amPm = FormatToAmPm(`${hours}:${minutes}:${seconds}`)
    return `${year}-${month}-${day} ${amPm}`;
}

export function FormatTimeHHMM(timeStr) {
  if (!timeStr || typeof timeStr !== "string") return "";
  const parts = timeStr.split(":");
  if (parts.length < 2) return timeStr; // fallback if format is invalid
  return `${parts[0]}:${parts[1]}`;
}