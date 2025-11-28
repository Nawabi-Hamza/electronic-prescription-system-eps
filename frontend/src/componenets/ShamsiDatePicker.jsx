import React, { useState, useEffect } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";
import { Calendar } from "lucide-react";
import "./JalaliStyle.css";
import { inputStyle } from "../styles/componentsStyle";
import jalaali from "jalaali-js";

const shamsiMonths = [
  ["حمل", "حمل"], ["ثور", "ثور"], ["جوزا", "جوزا"],
  ["سرطان", "سرطان"], ["اسد", "اسد"], ["سنبله", "سنبله"],
  ["میزان", "میزان"], ["عقرب", "عقرب"], ["قوس", "قوس"],
  ["جدی", "جدی"], ["دلو", "دلو"], ["حوت", "حوت"],
];

const afghanLocale = {
  ...persian_fa,
  months: shamsiMonths,
  digits: "0123456789"
};

const minDate = new DateObject({ date: "1300-01-01", calendar: persian, format: "YYYY-MM-DD" });
const maxDate = new DateObject({ date: "1500-01-01", calendar: persian, format: "YYYY-MM-DD" });

export function JalaliMonthPicker({ value, onChange }) {
  const initialDate = value
    ? new DateObject({
        year: parseInt(value.split("-")[0]),
        month: parseInt(value.split("-")[1]),
        day: 1,
        calendar: persian,
        locale: afghanLocale,
      })
    : new DateObject({ calendar: persian, locale: afghanLocale });

  const [date, setDate] = useState(initialDate);
  useEffect(() => {
    if (date && onChange) {
      onChange(`${date.year}-${String(date.month.number).padStart(2, "0")}`);
    }
  }, [date]);
  
  return (
    <div className={inputStyle.primary+" flex items-center space-x-2"}>
      <DatePicker
        onlyMonthPicker
        value={date}
        onChange={setDate}
        calendar={persian}
        locale={afghanLocale}
        format="YYYY/MM"
        className={inputStyle}
        minDate={minDate}
        maxDate={maxDate}
      />
      <Calendar className="text-gray-400" size={18} />
    </div>
  );
}


export function JalaliDateField({ value, onChange, placeholder = "1400-01-01"}) {
  let initialValue = null;

  if (typeof value === "string" && value) {
    try {
      initialValue = new DateObject({ date: value, calendar: persian, format: "YYYY-MM-DD" });
    } catch (e) { console.warn(e); }
  }
  return (
    <div className={"relative w-full min-w-[180px] h-[42px]"} >
      <DatePicker
        calendar={persian}
        locale={afghanLocale}
        value={initialValue}
        onChange={(date) => onChange(date ? date.format("YYYY-MM-DD") : "")}
        format="YYYY-MM-DD"
        calendarPosition="bottom-right"
        inputClass={`${inputStyle.primary} absolute top-0 bottom-0`} // add padding for the icon
        placeholder={placeholder}
        minDate={minDate}
        maxDate={maxDate}
      />
      <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
    </div>
  );
}

export function ShamsiToday(){
    const today = new DateObject({ calendar: persian });
    return today
}
// 1404-06-21
export function ShamsiDate(){
  const gregorianDate = new Date().toISOString().slice(0, 10)
  const [gy, gm, gd] = gregorianDate.split('-').map(Number);
  const { jy, jm, jd } = jalaali.toJalaali(gy, gm, gd);
    // return in YYYY-MM-DD format
  return `${jy.toString().padStart(4,'0')}-${jm.toString().padStart(2,'0')}-${jd.toString().padStart(2,'0')}`
}
// 1404-06
export function ShamsiYearMonth(){
    const today = new DateObject({ calendar: persian });
    return `${today.year}-${String(today.month.number).padStart(2,"0")}`
}
// 1404
export function ShamsiYear(){
    const today = new DateObject({ calendar: persian });
    return today.year
}
// 6
export function ShamsiMonth(){
    const today = new DateObject({ calendar: persian });
    return today.month.number
}
// 23
export function ShamsiDay(){
    const today = new DateObject({ calendar: persian });
    return today.day
}

export function GenerateMonthDays({ monthYear, attendance }){
    const today = new DateObject({ calendar: persian });
    const [shYear, shMonth] = monthYear.split("-").map(Number);
    const firstDayObj = new DateObject({ year: shYear, month: shMonth, day: 1, calendar: persian });
    const daysInMonth = firstDayObj.month.length;

    const daysArray = [];

    // Add empty slots based on the actual first day of the month
    const firstDayOfWeek = firstDayObj.weekDay.index; // 0=شنبه, 6=جمعه
    for (let i = 0; i < firstDayOfWeek; i++) {
      daysArray.push({ day: null, date: null, status: null });
    }

    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      const dayObj = new DateObject({ year: shYear, month: shMonth, day: i, calendar: persian });
      const formattedShamsi = `${dayObj.year}-${String(dayObj.month.number).padStart(2,"0")}-${String(dayObj.day).padStart(2,"0")}`;
      const isToday =
        dayObj.year === today.year &&
        dayObj.month.number === today.month.number &&
        dayObj.day === today.day;

      daysArray.push({
        day: dayObj.day,
        date: formattedShamsi,
        status: attendance[formattedShamsi] || "N/A",
        isSelected: dayObj.day === isToday,
      });
    }

    return daysArray;
};