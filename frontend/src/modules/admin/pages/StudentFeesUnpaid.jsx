import React, { useEffect, useMemo, useState } from "react";
import { badge, dropdownStyle, flexStyle } from "../../../styles/componentsStyle";
import { inputStyle } from "../../../styles/componentsStyle";
import Table from "../../../componenets/Table";
import { JalaliMonthPicker, ShamsiYearMonth } from "../../../componenets/ShamsiDatePicker";
import { Printer, Search } from "lucide-react";
import ImageViewer from "../../../componenets/ImageViewer";
import { getUnpaidStudents } from "../../../api/adminAPI";
import { printStudentFees } from "../components/printReports";

function StudentFeesUnpaid() {
    const [monthYear,setMonthYear] = useState(ShamsiYearMonth())
    const [students, setStudents] = useState([]);
    const [filterClass, setFilterClass] = useState([])
    const [search, setSearch] = useState("");

    useEffect(() => { getUnpaidStudents({ seter: setStudents, date: monthYear }) }, [monthYear]);

    useEffect(()=>{
      const sc = new Set()
      students.map( i => sc.add(i.class_code) )
      setFilterClass(Array.from(sc))
    },[students])
    // 🔍 Filter students
    const filteredStudents = useMemo(() => {
        const term = search.toLowerCase()
            return students.filter((s) =>
                `${s.student_name}`.toLowerCase().includes(term) ||
            (s.student_code || "").toLowerCase().includes(term) ||
            (s.class_code || "").toLowerCase().includes(term)
        )
    }, [students, search]);
    const handlePrint = ()=>{
        printStudentFees(monthYear, filteredStudents)
    }
return (
    <>

      <h1 className="text-2xl font-semibold mb-4">Student Fees</h1>
        <HeaderSection filterClass={filterClass} searchTerm={search} setSearchTerm={setSearch} date={monthYear} setDate={(val) => setMonthYear(val)} handlePrint={handlePrint}  />

        <Table
          columns={[
                  { key: "student_code", label: "ID" },
                  { key: "profile", label: "profile", render: (val, row) => (
                    <ImageViewer
                      imagePath={`/uploads/students_profile/${val}`}
                      altText={`${row.firstname}`}
                      className="w-10 h-10 rounded-md object-cover"
                      showPreview={false}
                    />
                  )},
                  { key: "student_name", label: "fullname"},
                  { key: "class_code", label: "Class" },
                  { key: "class_fee", label: "Class Fee", render: (val) => Number(val)+" AF" },
                  { key: "status", label: "status" , render: (val)=>( <span className={"font-semibold capitalize "+(badge.dangerSm)}>{val}</span>)}
              ]}
          records={filteredStudents}
          
      />
     
    </>
  )
}

export default StudentFeesUnpaid
function HeaderSection({ searchTerm, setSearchTerm, date, setDate, handlePrint, filterClass }){
    return(
      <div className={flexStyle.between+" mb-4 gap-2"}>
        <select name="" id="" onClick={(e) => setSearchTerm(e.target.value)} className={dropdownStyle.base+" max-w-fit"}>
          <option value="">Select By Class</option>
          {filterClass.map( (fc, i) => (
            <option key={i} value={fc} >{fc}</option>
          ))}
        </select>
        <div className="relative w-full">
          <Search className={inputStyle.searchIcon} />
          <input
            type="text"
            className={inputStyle.primary}
            placeholder="Search User by ID, Name, Class, Status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <JalaliMonthPicker value={date} onChange={ (val)=> setDate(val) }/>
        </div>
          <Printer className={'h-10 w-10 cursor-pointer text-sky-600'} onClick={handlePrint} />

      </div>
    )
}

