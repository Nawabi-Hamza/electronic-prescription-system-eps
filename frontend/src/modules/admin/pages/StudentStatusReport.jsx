import React, { useEffect, useState } from "react";
import { fetchStudentsStatusReport } from "../../../api/adminAPI";
import { badge, dropdownStyle, labelStyle } from "../../../styles/componentsStyle";
import { btnStyle } from "../../../styles/componentsStyle";
import Table from "../../../componenets/Table";
import ImageViewer from "../../../componenets/ImageViewer";
import { printStudentStatus } from "../components/printReports";
import { JalaliMonthPicker, ShamsiYearMonth } from "../../../componenets/ShamsiDatePicker";

function StudentStatusReport() {
  const [students, setStudents] = useState([]);
  const [status,setStatus] = useState([])
  const [filteredStudents,setFilteredStudents] = useState([])
  const [startDate,setStartDate] = useState(ShamsiYearMonth().split("-")[0]+"-01")
  const [endDate,setEndDate] = useState(ShamsiYearMonth())

    async function ShowAll(sd, ed) {
        try {
            const { d, s } = await fetchStudentsStatusReport( sd, ed );
            setStudents(d);
            setFilteredStudents(d)
            setStatus([])
            s.forEach( item => setStatus( prev => [ ...prev, item ]) )
        } catch (err) {
            console.log(err?.response?.data);
            setFilteredStudents([])
        }
    }

    useEffect(() => { ShowAll(startDate, endDate) }, [startDate, endDate]);
    

    const handleChange = (e)=>{
        setFilteredStudents( students.filter( item => item.status === e.target.value) )
    }  

    const handlePrint = ()=>{
        if(filteredStudents.length > 0){            
            printStudentStatus(filteredStudents, filteredStudents[0]?.status, startDate, endDate)
        }
    }

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">Student Reports</h1>
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-2 mb-4">
            {/* Search bar */}
            <label className={labelStyle.primary}>Start Date
                <JalaliMonthPicker value={startDate} onChange={(val) => setStartDate(val)} />
            </label>
            <label className={labelStyle.primary}>End Date
                <JalaliMonthPicker value={endDate} onChange={(val) => setEndDate(val)} />
            </label>
            <select name="" onChange={handleChange} className={dropdownStyle.base+" mt-2"} id="">
                <option value="">Select Students Type</option>
                {status && status?.map( (item, i) => (
                    <option key={i} value={item} className="capitalize">{item == 'c_parcha'? "3 Parcha":item}</option>
                ))}
            </select>
            <button className={btnStyle.filled+" mt-2"} onClick={handlePrint}>Print</button>
        </div>
      <Table
          columns={[
                  { key: "generated_id", label: "ID" },
                  { key: "profile", label: "profile", render: (val, row) => (
                    <ImageViewer
                      imagePath={`/uploads/students_profile/${val}`}
                      altText={`${row.firstname}`}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                  )},
                  { key: "firstname", label: "fullname", render: (val, row) => ( row.firstname + " " + row.lastname)},
                  { key: "class_code", label: "Class" },
                  { key: "assas_number", label: "Assas number" },
                  { key: "updated_at", label: "Latest Update" },
                  { key: "status", label: "status" , render: (val)=>( <span className={"font-semibold capitalize "+(val === "active"
                        ? badge.successSm
                        : val === "c_parcha"
                        ? badge.primarySm
                        : val === "pending"
                        ? badge.warningSm
                        : badge.dangerSm)}>{val=="c_parcha"? "3 Parcha":val}</span>)}
              ]}
          records={filteredStudents}
         
      />
     
    </>
  );
}

export default StudentStatusReport;
