import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Search } from "lucide-react";
import { cardStyle, divStyle, flexStyle, gridStyle, inputStyle } from "../../../styles/componentsStyle";
import { fetchClasses } from "../../../api/adminAPI";
import { FormatTimeHHMM } from "../../../componenets/Date&Time";

function ClassesAttendance() {
      const [classes, setClasses] = useState([]);
      const [searchTerm, setSearchTerm] = useState("");

       useEffect(() => { fetchClasses({ seter: setClasses}) }, []);
      
        // filter by name or code
        const filteredClasses = useMemo(()=>{
          const term = searchTerm.toLowerCase()
          return classes.filter((cls) =>
            (`${cls.class_name} ${cls.class_code} ${cls.room_number}`).toLowerCase().includes(term)
          );
        }, [classes, searchTerm])
  return (
        <>
          <HeaderSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <CardClasses filteredClasses={filteredClasses} />    
        </>
  )
}

export default ClassesAttendance

function HeaderSection({ searchTerm, setSearchTerm }){
    return(
      <div className={divStyle.betweenResponsiveReverse}>
        <div className="relative w-full">
          <Search className={inputStyle.searchIcon} />
          <input
            type="text"
            className={inputStyle.primary}
            placeholder="Search class by: Name, Code, Room Number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>)
}

function CardClasses({ filteredClasses }){
  const navigate = useNavigate();
  return(
      <div className={gridStyle.item4atRowNoScroll}>
        {filteredClasses.length > 0 ? (
          filteredClasses.map((cls) => (
            <div
              key={cls.class_id}
              onClick={() => navigate(`/admin/student-attendance/${btoa(cls.class_id)}?code=${encodeURIComponent(cls.class_code)}`)}
              className={cardStyle.cardContainer}
            >
            <div className={`${flexStyle.between} mb-2 border-b-1 border-gray-200`}>
                <h1 className="text-2xl font-bold text-gray-600">
                    {cls.class_code}
                </h1>
                <GraduationCap className="h-12 w-12 text-sky-600" />
            </div>
              <div className={`${flexStyle.between} mb-2`}>
                <p className="text-sm font-bold">Start: {FormatTimeHHMM(cls.start_timing)}</p>
                <p className="text-sm font-bold">End: {FormatTimeHHMM(cls.end_timing)}</p>
              </div>
              
            <p className="text-sm">Room Number: {cls.room_number}</p>
            <p className="text-sm">Students: {cls.active_student_count}</p>
              <p className="text-md">
                Status:{" "}
                <span
                  className={
                    cls.class_status === "Inactive"
                      ? "text-red-400"
                      : cls.class_status === "Active" ? "text-sky-400" : "text-green-400"
                  }
                >
                  {cls.class_status}
                </span>
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No classes found</p>
        )}
      </div>
  )
}
