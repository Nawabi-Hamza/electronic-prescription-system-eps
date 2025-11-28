import React, { useEffect, useMemo, useState } from "react";
import { fetchAllStudentsAllStatus, updateStudent3Parcha } from "../../../api/adminAPI";
import { badge, tableStyles } from "../../../styles/componentsStyle";
import { btnStyle, inputStyle } from "../../../styles/componentsStyle";
import { ConfirmToast } from "../../../componenets/Toaster";
import { toast } from "react-toastify";
import Table from "../../../componenets/Table";
import ImageViewer from "../../../componenets/ImageViewer";

function StudentLeave() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  async function ShowAll() {
    try {
      const res = await fetchAllStudentsAllStatus();
      setStudents(res || []);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => { ShowAll() }, []);

  const handle3Parcha = (id) => {
    ConfirmToast(`Are you sure to 3 Parcha this student: ${id}`, async () => {
      try {
        const res = await updateStudent3Parcha(id);
        toast.success(res.message);

        // update record locally
        setStudents((prev) =>
          prev.map((s) =>
            s.generated_id === id ? { ...s, status: "c_parcha" } : s
          )
        );
      } catch (err) {
        console.log(err);
        toast.error("Failed to update student");
      }
    });
  };

  // 🔍 Filter students
  const filteredStudents = useMemo(() => {
    const term = search.toLowerCase()
    return students.filter(
          (s) =>
            `${s.firstname} ${s.lastname}`.toLowerCase().includes(term) ||
            (s.class_code || "").toLowerCase().includes(term) ||
            (s.generated_id || "").toLowerCase().includes(term) ||
            (s.assas_number || "").toLowerCase().includes(term) || 
            (s.status || "").toLowerCase()==(term === '3 parcha'?"c_parcha":term) 
        )
  }, [students, search]);

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">Student Leave Status</h1>

      {/* Search bar */}
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          className={inputStyle.primary + " w-64"}
          placeholder="Search by name, class, or ASAS..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
                  { key: "status", label: "status" , render: (val)=>( <span className={"font-semibold capitalize "+(val === "active"
                        ? badge.successSm
                        : val === "c_parcha"
                        ? badge.primarySm
                        : val === "pending"
                        ? badge.warningSm
                        : badge.dangerSm)}>{val=="c_parcha"? "3 Parcha":val}</span>)}
              ]}
          records={filteredStudents}
          actions={(row) => [
              {
                  label: row.status === "c_parcha" ? <span className="text-gray-500 italic">Leaved</span>:<span className={btnStyle.filledSm}>3 Parcha</span>,
                  className: tableStyles.primaryBtn,
                  onClick: () => {
                    if(row.status !== "c_parcha"){
                       handle3Parcha(row.generated_id)
                    }
                  },
              }
            ]}
      />
     
    </>
  );
}

export default StudentLeave;
