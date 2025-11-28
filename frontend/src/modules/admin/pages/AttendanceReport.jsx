import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowBigRight, GraduationCap, Printer, Search } from "lucide-react";
import { badge, cardStyle, flexStyle, gridStyle, inputStyle, labelStyle } from "../../../styles/componentsStyle";
import { fetchClasses, getClassAttendanceReportByDate } from "../../../api/adminAPI";
import { FormatTimeHHMM } from "../../../componenets/Date&Time";
import { JalaliMonthPicker, ShamsiYearMonth } from "../../../componenets/ShamsiDatePicker";
import { toast } from "react-toastify";
import { printClassStudentAtt } from "../components/printReports";

function AttendanceReport() {
    const [classes, setClasses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate,setStartDate] = useState(ShamsiYearMonth().split("-")[0]+"-01")
    const [endDate,setEndDate] = useState(ShamsiYearMonth())
    
    useEffect(() => { fetchClasses({ seter: setClasses }) }, []);

    

    // filter by name or code
    const filteredClasses = useMemo(()=>{
      const term = searchTerm.toLowerCase()
      return classes.filter((cls) =>
          (`${cls.class_name} ${cls.class_code} ${cls.room_number}`).toLowerCase().includes(term)
        )
    }, [classes, searchTerm]);
  return (
        <>
          <HeaderSection startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <CardClasses filteredClasses={filteredClasses} startDate={startDate} endDate={endDate} />
        </>
  )
}

export default AttendanceReport

function HeaderSection({ searchTerm, setSearchTerm, startDate, endDate, setStartDate, setEndDate }){
  
    return(
      <>
      <div className={flexStyle.between+" flex-wrap md:flex-nowrap gap-2"}>
        <label className={labelStyle.primary}>Start Date
          <JalaliMonthPicker value={startDate} onChange={(val) => setStartDate(val)} />
        </label>
        <label className={labelStyle.primary}> End Date
          <JalaliMonthPicker value={endDate} onChange={(val)=> setEndDate(val)} />
        </label>
        <div className="relative w-full mt-3">
          <Search className={inputStyle.searchIcon} />
          <input
            type="text"
            className={inputStyle.primary}
            placeholder="Search class by: Name, Code, Room Number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      </>
      )
}

function CardClasses({ filteredClasses, startDate, endDate }){
  const navigate = useNavigate();
  // const [classCode,setClassCode] = useState('')
  const handlePrintClassAttendance = async(class_code) => {
    try{
      const response = await getClassAttendanceReportByDate(class_code, startDate, endDate)
      printClassStudentAtt(class_code, response, startDate, endDate)
    }catch(err){
      toast.error(err)
    }
  }

  // useEffect(()=>{
    // if(classCode.length > 0){
      // handlePrintClassAttendance(classCode)
    // }
  // }, [classCode])

 
  return(
      <div className={gridStyle.item4atRowNoScroll}>
        {filteredClasses.length > 0 ? (
          filteredClasses.map((cls) => (
            <div
              key={cls.class_id}
              onClick={() => navigate(`/admin/attendance-report/${btoa(cls.class_id)}?code=${encodeURIComponent(cls.class_code)}`)}
              className={cardStyle.cardContainer}
            >
              <div className={`${flexStyle.between} mb-2 border-b-1 border-gray-200`}>
                  <h1 className="text-2xl font-bold text-gray-600">
                      {cls.class_code}
                  </h1>
                  <div className="flex gap-2">
                    <Printer onClick={(e) => {
                      e.stopPropagation()
                      // setClassCode(cls.class_code)
                      handlePrintClassAttendance(cls.class_code)
                    }} className="text-amber-600" />
                    {/* <ArrowBigRight onClick={() => navigate(`/admin/attendance-report/${btoa(cls.class_id)}?code=${encodeURIComponent(cls.class_code)}`)} className="text-sky-600" /> */}
                  </div>
              </div>
              <div className={`${flexStyle.between} mb-2`}>
                <p className="text-sm font-bold">Start: {FormatTimeHHMM(cls.start_timing)}</p>
                <p className="text-sm font-bold">End: {FormatTimeHHMM(cls.end_timing)}</p>
              </div>
              <p className="text-sm mb-2">Room Number: {cls.room_number}</p>
              <p className={badge.primarySm}>Total Students: {cls.active_student_count}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No classes found</p>
        )}
      </div>
  )
}
