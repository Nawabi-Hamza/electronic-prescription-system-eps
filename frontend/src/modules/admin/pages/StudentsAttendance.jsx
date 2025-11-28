import React, { useEffect, useState } from "react";
import { Check, X, CircleArrowOutUpRight } from "lucide-react";
import { getClassStudents, saveClassAttendance } from "../../../api/adminAPI";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { btnStyle, flexStyle } from "../../../styles/componentsStyle";
import { ConfirmToast } from "../../../componenets/Toaster";
import { toast } from "react-toastify";
import Table from "../../../componenets/Table";
import ImageViewer from "../../../componenets/ImageViewer"; 

function StudentsAttendance({ teacherId }) {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [submitted, setSubmitted] = useState(false); // <--- track submission
  const { classId } = useParams();
  const location = useLocation();
  const class_id = atob(classId);

  const queryParams = new URLSearchParams(location.search);
  const class_code = queryParams.get("code");

  const navigate = useNavigate();

  useEffect(() => {
      const fetchStudents = async () => {
        if (!class_id) return;

        try {
          const data = await getClassStudents(class_id);
          setStudents(data);
        } catch (err) {
          console.error("Error fetching students:", err);
        }
      };

      fetchStudents();
  }, [class_id]);

  const onAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = () => {
    const payload = {
      class_id,
      teacher_id: teacherId,
      records: students.map((s) => ({
        student_id: s.student_id,
        status: attendance[s.student_id] || "absent",
      })),
    };

    ConfirmToast("Are you sure to save attendance?", async () => {
      try {
        await saveClassAttendance(payload);
        toast.success(`Attendance saved successfully students`);
        setSubmitted(true)

      } catch (err) {
        console.error("Error saving attendance:", err);
        toast.error("Attendance already taken today!");
      }
    });
  };

  return (
    <>
      <div className={`${flexStyle.between} mb-3`}>
        <h1 className="font-semibold text-xl">Student for class {class_code}</h1>
        <button onClick={() => navigate("/admin/student-attendance")} className={btnStyle.backBtn}>
          ← Back
        </button>
      </div>

      <Table
          columns={[
                  { key: "student_code", label: "ID" },
                  { key: "profile", label: "profile", render: (val, row) => (
                    <ImageViewer
                      imagePath={`/uploads/students_profile/${val}`}
                      altText={`${row.firstname}`}
                      className="w-12 h-12 rounded-sm shadow object-cover"
                    />
                  )},
                  { key: "firstname", label: "fullname", render: (val, row) => ( row.firstname + " " + row.lastname)},
                  { key: "phone", label: "Phone" },
              ]}
          records={students}
          actions={(row) => [
              ...(row.attendance_status === "not_marked" && !submitted ?
              [{
                  label: <Check size={16} />,
                  className: `px-2 py-1 rounded ${ attendance[row.student_id] === "present" ? "bg-green-300" : "bg-gray-200" }`,
                  onClick: () =>  onAttendanceChange(row.student_id, "present"),
              },
              {
                  label: <X size={16} />,
                  className: `px-2 py-1 rounded ${ attendance[row.student_id] === "absent" ? "bg-red-300" : "bg-gray-200" }`,
                  onClick: () =>  onAttendanceChange(row.student_id, "absent"),
              },
              {
                  label: <CircleArrowOutUpRight size={16} />,
                  className: `px-2 py-1 rounded ${ attendance[row.student_id] === "leave" ? "bg-yellow-500 text-white" : "bg-gray-200" }`,
                  onClick: () =>  onAttendanceChange(row.student_id, "leave"),
              }]:
              submitted ? [{

                    label: attendance[row.student_id],
                    className: `px-2 text-sm rounded capitalize ${
                        attendance[row.student_id] === "present"
                          ? "bg-green-300"
                          : attendance[row.student_id] === "absent"
                          ? "bg-red-300"
                          : "bg-yellow-500 text-white"
                      }`,
                    onClick: () => {}
                }]
                : [{

                    label: row.attendance_status,
                    className: `px-2 text-sm rounded capitalize ${
                        row.attendance_status === "present"
                          ? "bg-green-300"
                          : row.attendance_status === "absent"
                          ? "bg-red-300"
                          : "bg-yellow-500 text-white"
                      }`,
                    onClick: () => {}
                }]
            )]}
      />
    
      {!submitted && students[0]?.attendance_status === "not_marked" && (
        <div className="mt-4 flex justify-end">
          <button onClick={handleSaveAttendance} className={btnStyle.filled}>
            Save Attendance
          </button>
        </div>
      )}
    </>
  );
}

export default StudentsAttendance;
