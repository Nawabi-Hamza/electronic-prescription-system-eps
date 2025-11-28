import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { btnStyle, divStyle, dropdownStyle, flexStyle, inputStyle, labelStyle } from "../../../styles/componentsStyle";
import { CircleFadingPlus, CircleMinus, Search } from "lucide-react";
import { tableStyles as ts } from "../../../styles/componentsStyle";
import ImageViewer from "../../../componenets/ImageViewer";
import { toast } from "react-toastify";
import Modal from "../../../componenets/ModalContainer";
import { addStudentToClass, changeStatusClass, loadStudentsClass, loadStudentsNotInClass, removeStudentFromClass } from "../../../api/adminAPI";
import Table from "../../../componenets/Table";
import { ConfirmToast } from "../../../componenets/Toaster";
import { ShamsiToday, ShamsiYear } from "../../../componenets/ShamsiDatePicker";

function ClassStudents() {
  const { classId } = useParams();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [thisClass, setThisClass] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [year, setYear] = useState(ShamsiYear());

  const navigate = useNavigate();
  
  
  const isCurrentYear = year === ShamsiYear();

  // Load students in this class
  const loadStudents = async () => {
    try {
      loadStudentsClass({ classId: classId, year: year, seter: setStudents, seter2: setThisClass})
    } catch (err) {
      console.error(err);
      navigate("/admin/classes");
      toast.error("This class does not exist");
    }
  };

  useEffect(() => { loadStudents() }, [year]);

  // Load students not in this class (only for current year)
  const loadAvailableStudents = async () => {
    try {
      loadStudentsNotInClass({ isCurrentYear: isCurrentYear , year: year, seter: setAvailableStudents })
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const filteredStudents = useMemo(() => {
    const term = search.toLowerCase()
    return students.filter((s) => 
        `${s.firstname} ${s.father_name || ""} ${s.lastname}`.toLowerCase().includes(term) ||
        s.email?.toLowerCase().includes(term) ||
        s.generated_id?.toString().toLowerCase().includes(term)
      )
  }, [students, search]);

  const handleAddStudentToClass = async (studentId, newRecord) => {
    if (!isCurrentYear) return;
    try {
      const res = addStudentToClass({ isCurrentYear: isCurrentYear, studentId: studentId, classId: classId })
      setSearch("");
      setStudents(prev => [...prev, newRecord]);
      setAvailableStudents(prev => prev.filter((s) => s.student_id !== studentId));
      toast.success(res?.data?.message);
    } catch (err) {
      console.error(err);
      toast.error("Add student failed");
    }
  };

  const handleRemoveStudent = (studentId, removedStudent) => {
    if (!isCurrentYear) return;
    ConfirmToast(`Are you sure to remove ${removedStudent.firstname} student`, async()=>{
      try {
        const res = await removeStudentFromClass({ studentId: studentId, classId: classId });
        setStudents(prev => prev.filter((s) => s.student_id !== studentId));
        setAvailableStudents(prev => [...prev, removedStudent]);
        toast.success(res?.data?.message);
      } catch (err) {
        console.error(err);
        toast.error("Error removing student");
      }
    })
  };

  return (
    <>
      <div className={`${flexStyle.between} gap-2 mb-3`}>
        <div className="mt-2 w-full bg-sky-200 rounded-md p-2 ">
          🎉 You have {students?.length} student in the year {year} in class {thisClass?.class_code}
        </div>
        <button onClick={() => navigate("/admin/classes")} className={btnStyle.backBtn+" text-nowrap"}>← Back</button>
      </div>

      {/* Search + Add */}
      <HeaderSection search={search} setSearch={setSearch} setIsModalOpen={loadAvailableStudents} isCurrentYear={isCurrentYear} />
        
      <div className={flexStyle.between+ " mt-2 flex-wrap"}>
        {/* Year selector */}
        <SelectYearStudentOfClass today={ShamsiToday()} year={year} setYear={setYear} />
        {/* Show class status */}
        <SelectClassStatus totalStudents={students?.length} classId={classId} thisClass={thisClass} isCurrentYear={isCurrentYear} />
      </div>
      {!isCurrentYear && (
        <p className="text-red-400 mb-2">
          You are viewing a year other than the current year. Add/remove and actions are disabled.
        </p>
      )}
    
      <AddStudentToClassModal isModalOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} availableStudents={availableStudents} handleAddStudentToClass={handleAddStudentToClass} isCurrentYear={isCurrentYear} />

      <Table
          columns={[
                  { key: "generated_id", label: "ID" },
                  { key: "profile", label: "profile", render: (val, row) => (
                    <ImageViewer
                      imagePath={`/uploads/students_profile/${val}`}
                      altText={`${row.firstname}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )},
                  { key: "firstname", label: "full_name", render: (val, row) => ( row.firstname + " " + row.lastname)},
                  { key: "phone", label: "Phone" },
                  { key: "status", label: "status", render: (val)=> (val=="c_parcha"? "3 Parcha":<span className="capitalize">{val}</span>) },
              ]}
          records={filteredStudents}
          actions={(row) => [
              {
                  label: <CircleMinus size={20} />,
                  className: ts.dangerBtn,
                  onClick: () =>  handleRemoveStudent(row.student_id, row),
              }
            ]}
      />
    </>
  );
}

// Header with search and Add button
function HeaderSection({ search, setSearch, setIsModalOpen, isCurrentYear }) {
  return (
    <div className={divStyle.betweenResponsiveReverse}>
      <div className="relative w-full">
        <Search className={inputStyle.searchIcon} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search student by name, email, or code"
          className={inputStyle.primary}
        />
      </div>
      {isCurrentYear && (
        <button onClick={() => setIsModalOpen(true)} className={btnStyle.filled}>
          + Add Student to this class
        </button>
      )}
    </div>
  );
}

export function SelectYearStudentOfClass({ today, year, setYear }) {
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

function SelectClassStatus({ classId, thisClass, isCurrentYear, totalStudents }) {
  const [status, setStatus] = useState(thisClass?.class_status || "");
  const navigate = useNavigate()
  let allStatus = ["Active", "Inactive" ]
  if(totalStudents === 0) allStatus.push("Delete")

  useEffect(() => { setStatus(thisClass?.class_status || "") }, [thisClass]);
  // console.log(navigate('/admin'))
  const handleSaveStatus = async () => {
    if (!isCurrentYear) return; // only allow changing status for current year
    ConfirmToast("Are you sure want to change class status?", async()=>{
      try {
        await changeStatusClass(classId, status)
        navigate("/admin/classes")
        toast.success(`Class status updated to ${status}`);
      } catch (err) {
        console.error(err);
        toast.error("Failed to update class status");
      }
    })
  };

  return (
      isCurrentYear && (
        <div className="mb-2 flex gap-2 items-center">
          <label htmlFor="status" className={labelStyle.primary}>Status:</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={`${dropdownStyle.base}`}
            style={{ maxWidth: "300px" }}
            disabled={!isCurrentYear} // disable dropdown for past/future years
          >
            {allStatus.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          
            <button onClick={handleSaveStatus} className={btnStyle.filled}>
              Save Status
            </button>
        </div>
      )
  );
}

function AddStudentToClassModal({ isModalOpen, availableStudents, handleAddStudentToClass, closeModal, isCurrentYear }) {
  const [search, setSearch] = useState("");
  const filteredStudents = useMemo(()=>{
    const term = search.toLowerCase()
    return availableStudents.filter( s => 
      (`${s.firstname} ${s.father_name} ${s.lastname}`).toLowerCase().includes(term) ||
      s.generated_id.toLowerCase().includes(term) 
    )
  }, [availableStudents, search])

  if (!isModalOpen || !isCurrentYear) return null;

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal} containerStyle="sm" title="Add New Student to class">
      <div className="relative w-full">
        <Search className={inputStyle.searchIcon} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search student by name, father name or id"
          className={inputStyle.primary}
        />
      </div>
      <br />
      <Table
          columns={[
                  { key: "generated_id", label: "ID" },
                  { key: "profile", label: "profile", render: (val, row) => (
                    <ImageViewer
                      imagePath={`/uploads/students_profile/${val}`}
                      altText={`${row.firstname}`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )},
                  { key: "firstname", label: "fullname", render: (val, row) => ( row.firstname + " " + row.father_name)},
                  { key: "phone", label: "Phone" },
              ]}
          records={filteredStudents}
          actions={(row) => [
              {
                  label: <CircleFadingPlus size={20} />,
                  className: ts.primaryBtn,
                  onClick: () =>  handleAddStudentToClass(row.student_id, row),
              }
            ]}
      />
    </Modal>
  );
}

export default ClassStudents;
