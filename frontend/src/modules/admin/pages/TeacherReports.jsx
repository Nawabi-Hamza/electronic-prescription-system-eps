import React, { useEffect, useMemo, useState } from "react";
import { inputStyle } from "../../../styles/componentsStyle";
import { toast } from "react-toastify";
import { getTeacherAttendanceByDate } from "../../../api/adminAPI";
import { JalaliDateField, ShamsiDate } from "../../../componenets/ShamsiDatePicker";
import Table from "../../../componenets/Table";

function TeacherAttendanceReports() {
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");  
  const [date, setDate] = useState(ShamsiDate());

  const fetchAttendance = async (selectedDate) => {
    try {
      const data = await getTeacherAttendanceByDate(selectedDate);
      setTeachers(data.data || []);
    } catch (error) {
      toast.error(error.message || "Failed to fetch teachers");
      setTeachers([]);
    }
  };

  useEffect(() => { fetchAttendance(date) }, [date]);

  // Filter teachers by search
  const filteredTeachers = useMemo(() => {
    const term = searchTerm.toLowerCase()
    return teachers.filter((t) =>
        t.firstname.toLowerCase().includes(term) ||
        t.lastname.toLowerCase().includes(term) ||
        t.email.toLowerCase().includes(term) ||
        t.phone.toLowerCase().includes(term)
    )
  }, [teachers, searchTerm]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Teacher Attendance Report</h1>

      {/* Date Picker + Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 w-full ">
          <label className="font-semibold">Search:</label>
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            className={`${inputStyle.primary} w-full`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="">
          <JalaliDateField value={date} onChange={(val)=> setDate(val)} />
        </div>
      </div>

      {/* Table */}
      <Table
          columns={[
                  { key: "user_id", label: "ID" },
                  { key: "firstname", label: "fullname", render: (val, row) => ( row.firstname + " " + row.lastname)},
                  { key: "phone", label: "Phone" },
                  { key: "email", label: "email" },
                  { key: "status", label: "status", render: (val)=> (<span className={`font-bold text-center capitalize ${
                      val === "present"
                        ? "text-green-400"
                        : val === "absent"
                        ? "text-red-400"
                        : val === "leave" 
                        ? "text-orange-400"
                        : "text-sky-400"
                    }`}>{val}</span>) },                  
              ]}
          records={filteredTeachers}
      />
     
    </div>
  );
}

export default TeacherAttendanceReports;
