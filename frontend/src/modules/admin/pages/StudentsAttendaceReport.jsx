import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { getAttendanceByDate, getClassStudentsReports } from "../../../api/adminAPI";
import { dropdownStyle, tableStyles } from "../../../styles/componentsStyle";
import { useNavigate, useParams } from "react-router-dom";
import { btnStyle, flexStyle, labelStyle } from "../../../styles/componentsStyle";
import ImageViewer from "../../../componenets/ImageViewer";
import { showModalStyle } from "../../../styles/modalStyles";
import Modal from "../../../componenets/ModalContainer";
import Table from "../../../componenets/Table";
import { toast } from "react-toastify";
import { GenerateMonthDays, JalaliMonthPicker, ShamsiToday, ShamsiYear, ShamsiYearMonth } from "../../../componenets/ShamsiDatePicker";

function StudentsAttendanceReport() {
  const [students, setStudents] = useState([]);
  const { classId } = useParams();
  const [showInfoModal, setInfoModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState([]);
  const [year, setYear] = useState(ShamsiYear());
  const navigate = useNavigate();
  
  const class_id = atob(classId);

  // 🔹 Default year is current year
  const fetchStudents = async () => {
    if (!class_id) return;
    try {
      const data = await getClassStudentsReports(class_id, year);
      setStudents(data);
    } catch (err) {
      console.error("Error fetching students:", err);
      toast.error(`No student in ${year} year`)
    }
  };
  useEffect(() => { fetchStudents() }, [class_id, year]);

  const handleSelectUser = (user_id) => {
    setSelectedStudent(() => students.filter((u) => u.student_id === user_id));
    setInfoModal(true);
  };

  return (
    <> 
      <div className={`${flexStyle.between} mb-3`}>
        <SelectYearStudentOfClass today={ShamsiToday()} year={year} setYear={setYear} />
        <button
          onClick={() => navigate("/admin/attendance-report")}
          className={btnStyle.backBtn}
        >
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
                      className="w-10 h-10 rounded-md object-cover"
                      showPreview={false}
                    />
                  )},
                  { key: "firstname", label: "fullname", render: (val, row) => ( row.firstname + " " + row.lastname)},
                  { key: "phone", label: "Phone" },
                  { key: "status", label: "status" },
              ]}
          records={students}
          actions={(row) => [
              {
                  label: <Eye size={20} />,
                  className: tableStyles.primaryBtn,
                  onClick: () =>  handleSelectUser(row.student_id),
              }
            ]}
      />

      {/* show report student attendance */}
      <ShowStudentsAttendanceModalInMonth
        showInfoModal={showInfoModal}
        selectedStudent={selectedStudent[0]}
        closeInfoModal={() => setInfoModal(false)}
      />
    </>
  );
}

export default StudentsAttendanceReport;

function SelectYearStudentOfClass({ today, year, setYear }) {
  return (
    <div className="mb-2 flex gap-2 items-center">
      <label htmlFor="year" className={labelStyle.primary}>Year:</label>
      <select
        id="year"
        value={year}
        onChange={(e) => setYear(Number(e.target.value))}
        className={`${dropdownStyle.base}`}
        style={{ maxWidth: "300px" }}
      >
        {Array.from({ length: 10 }, (_, i) => today.year - i).map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );
}

function ShowStudentsAttendanceModalInMonth({ showInfoModal, selectedStudent, closeInfoModal }) {

  const [monthYear, setMonthYear] = useState(ShamsiYearMonth());
  const [att, setAtt] = useState({});

  const fetchAtt = async () => {
    try {
      const [year, month] = monthYear.split("-");
      const res = await getAttendanceByDate(selectedStudent?.student_id, month, year);
      setAtt(res.attendance);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedStudent) fetchAtt();
  }, [monthYear, selectedStudent]);

  const handleDateChange = (e) => {
    setAtt({});
    setMonthYear(e); // YYYY-MM
  };


  const days = GenerateMonthDays({ monthYear: monthYear, attendance: att });

  const getStatusColor = (status) => {
    switch (status) {
      case "present": return "bg-green-100 text-green-700 border-green-400";
      case "absent": return "bg-red-100 text-red-700 border-red-400";
      case "leave": return "bg-yellow-100 text-yellow-700 border-yellow-400";
      // case "Holiday": return "bg-blue-100 text-blue-700 border-blue-400";
      default: return "bg-gray-100 text-gray-500 border-gray-300";
    }
  };

  if (!showInfoModal || !selectedStudent) return null;

  return (
    <Modal isOpen={showInfoModal} containerStyle={'sm'} onClose={closeInfoModal} title="Monthly Attendance Information">
      {/* Header */}
      <div className={showModalStyle.headerContainer}>
        <div className={showModalStyle.imageContainer}>
          <ImageViewer
            imagePath={`/uploads/students_profile/${selectedStudent?.profile}`}
            altText={selectedStudent?.firstname + " " + selectedStudent?.lastname}
            className={showModalStyle.image + " max-h-[120px]"}
          />
        </div>

        <div className={showModalStyle.headerContent}>
          <div className="min-w-[180px]"><span className="font-semibold block">ID:</span> {selectedStudent?.student_code}</div>
          <div className="min-w-[180px]"><span className="font-semibold block">Full Name:</span> {selectedStudent?.firstname} {selectedStudent?.lastname}</div>
          <div className="min-w-[180px]"><span className="font-semibold block">Email:</span> {selectedStudent?.email}</div>
          {/* Month Picker */}
          <div>
              <JalaliMonthPicker value={monthYear} onChange={handleDateChange} />
          </div>
          <div className="min-w-[180px]"><span className="font-semibold block">Phone:</span> {selectedStudent?.phone}</div>
          <div className="min-w-[180px] mb-2"><span className="font-semibold block">Gender:</span> <span className='capitalize'>{selectedStudent?.gender}</span></div>
        </div>

      </div>

      <hr className="my-6 border-gray-300" />

      {/* Shamsi weekdays header */}
      <div className="grid grid-cols-7 text-center font-medium text-gray-500 mb-2">
        {["شنبه", "یک شنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنج شنبه", "جمعه"].map((d) => <div key={d}>{d}</div>)}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-2 md:gap-3">
        {days.map((d, idx) => (
          <div
            key={idx}
            title={d.date}
            className={`p-2 rounded-md border text-center shadow-md transition-transform hover:scale-95 ${getStatusColor(d.status, d.isSelected)}`}
          >
            <div className="font-semibold">{d.day || ""}</div>
            <div className="text-xs hidden md:block capitalize">{d.status}</div>
          </div>
        ))}
      </div>
    </Modal>
  );
}