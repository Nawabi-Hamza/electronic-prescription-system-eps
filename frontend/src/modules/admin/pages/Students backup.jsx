import React, { useState, useEffect, useMemo } from "react";
import { tableStyles as ts } from "../../../styles/componentsStyle";
import { showModalStyle } from "../../../styles/modalStyles";
import { btnStyle, divStyle, dropdownStyle, gridStyle, inputStyle, labelStyle } from "../../../styles/componentsStyle";
import { Trash, UserPen, Eye, X, Search, PhoneCall, MessageCircle, MessageCircleDashed, MessageCircleMore } from "lucide-react";
import { useForm } from "react-hook-form";
import { studentFieldsGroups } from "../../../utils/FormFields";
import ImageViewer from "../../../componenets/ImageViewer";
import { toast } from "react-toastify";
import Modal from "../../../componenets/ModalContainer";
import { ConfirmToast } from "../../../componenets/Toaster";
import Table from "../../../componenets/Table";
import { deleteStudent, fetchStudents, createStudent } from "../../../api/adminAPI";
import FieldsResultStepper from "../../../componenets/FieldsGroupStepper";

const Students = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { reset } = useForm();
  const [refresh,setRefresh] = useState(false)

  // Fetch students
  const loadStudents = async () => {
    try {
      const data = await fetchStudents();
      setStudents(data);
    } catch (error) {
      console.error(`Error loading students: ${error.message}`);
      if(error.code==="ERR_NETWORK"){
        toast.error(`Error loading students: ${error.message}`);
      }

    }
  };

  useEffect(() => { loadStudents() }, [refresh]);

  function handleDelete(id){
    ConfirmToast("Are you sure to remove this student?", async()=>{
      try {
          await deleteStudent(id);
          setStudents((prevStudents) => prevStudents.filter(student => student.generated_id !== id));
          toast.success(`${id} student record removed successfuly`)
      } catch (error) {
          toast.error(`${id} Delete faild!`)
          console.error("Delete failed:", error);
      }
    })
  };
  

    const [showInfoModal, setShowInfoModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const showStudentInformation = (student) => {
        setSelectedStudent(student);
        setShowInfoModal(true);
    };

    const handleEdit = (record)=>{
      setSelectedStudent(record)
      setIsModalOpen(true)
    }

    const closeInfoModal = () => {
        setSelectedStudent(null);
        setShowInfoModal(false);
    };

    // Close modal handler (resets form)
    const closeModal = () => {
        reset();
        setIsModalOpen(false);
    };

  // Basic search filter for table (you can improve it)
  const filteredStudents = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return students.filter((s) => 
      s.generated_id?.toLowerCase().includes(term) ||
      (s.firstname +" "+ s.lastname)?.toLowerCase().includes(term) ||
      s.father_name?.toLowerCase().includes(term) ||
      s.email?.toLowerCase().includes(term) ||
      s.phone?.toLowerCase().includes(term) ||
      s.gender?.toLowerCase().includes(term) ||
      s.assas_number?.toLowerCase().includes(term) 
    )
  }, [students, searchTerm]);

  return (
    <>
    {/* Add Student Button + Search */}
    <HeaderSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} setIsModalOpen={setIsModalOpen} /><br />
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
                  { key: "phone", label: "Phone" },
                  { key: "assas_number", label: "Assas Number" },
                  { key: "student_class", label: "Class" },                  
              ]}
          records={filteredStudents}
          actions={(row) => [
              {
                  label: <Eye size={20} />,
                  className: ts.primaryBtn,
                  onClick: () =>  showStudentInformation(row),
              },
              row?.status?.includes("active", "pending") &&
              {
                  label: <UserPen size={20} />,
                  className: ts.primaryBtn,
                  onClick: () =>  handleEdit(row),
              },
              row?.status?.includes("active", "pending") &&
              {
                  label: <Trash size={20} />,
                  className: ts.dangerBtn,
                  onClick: () =>  handleDelete(row.generated_id),
              }
              
            ]}
    />
    <ShowStudentModal showInfoModal={showInfoModal} selectedStudent={selectedStudent} closeInfoModal={closeInfoModal} />
    <AddStudentModal selectedStudent={selectedStudent} isModalOpen={isModalOpen} closeModal={closeModal} setRefresh={setRefresh} setIsModalOpen={setIsModalOpen} />
    </>
  );
};

export default Students;

function HeaderSection({ searchTerm, setSearchTerm, setIsModalOpen}){
    return(<div className={divStyle.betweenResponsiveReverse}>
        <div className="relative w-full">
          <Search className={inputStyle.searchIcon} />
          <input
            type="text"
            className={inputStyle.primary}
            placeholder="Search Student by ID, Name, Assas Number, Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={() => setIsModalOpen(true)} className={btnStyle.filled}>
          + Add Student
        </button>
      </div>)
}

function ShowStudentModal({ showInfoModal, selectedStudent, closeInfoModal }) {
  if (!showInfoModal || !selectedStudent) return null;
  // console.log(selectedStudent)

  return (
    <Modal isOpen={showInfoModal} containerStyle="sm" onClose={closeInfoModal} title={`Information - ${selectedStudent.firstname}`}>
      {/* Top row: Picture + main info */}
        <div className={showModalStyle.headerContainer}>
          {/* Picture */}
            <ImageViewer
                imagePath={`/uploads/students_profile/${selectedStudent.profile}`}
                altText={`${selectedStudent.firstname}`}
                className={showModalStyle.image+ " max-h-40 w-auto"}
            />

          {/* Horizontal info next to picture */}
          <div className={showModalStyle.headerContent}>
            {/* Each info item with fixed min width for alignment */}
            <div className="min-w-[180px]">
              <span className="font-semibold block">ID:</span>
              {selectedStudent.generated_id}
            </div>
            <div className="min-w-[180px]">
              <span className="font-semibold block">Full Name:</span>
              {`${selectedStudent.firstname}  ${selectedStudent.lastname || ""}`}
            </div>
            <div className="min-w-[180px]">
              <span className="font-semibold block">Firstname:</span>
              {selectedStudent.firstname}
            </div>
            <div className="min-w-[180px]">
              <span className="font-semibold block">F/Name:</span>
              {selectedStudent.father_name}
            </div>
            <div className="min-w-[180px]">
              <span className="font-semibold block">Email:</span>
              {selectedStudent.email}
            </div>
            <div className="min-w-[180px]">
              <span className="font-semibold block">Phone:</span>
              <div>
                <span className="flex gap-1 items-center">
                  <PhoneCall size={15} /> {selectedStudent.phone}
                </span>
                <span className="flex gap-1 items-center">
                  <MessageCircleMore size={15} /> {selectedStudent.whatsapp_phone}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6 border-gray-300 overflow-y-auto" />

        {/* Bottom grid: other info in up to 3 columns */}
        <div className={gridStyle.item3atRow}>
          <div>
            <span className="font-semibold">Gender:</span><br />
            <span className="capitalize">
              {selectedStudent.gender}
            </span>
          </div>
          <div>
            <span className="font-semibold">DOB:</span><br />
            {selectedStudent.date_of_birth?.split('T')[0]}
          </div>
          <div>
            <span className="font-semibold">National ID:</span><br />
            {selectedStudent.national_id}
          </div>
           
          <div>
            <span className="font-semibold">Status:</span><br />
            <span className={`font-semibold capitalize ${selectedStudent.status === "active" ? "text-green-400" : "text-red-400"}`}>
              {selectedStudent.status}
            </span>
          </div>
          <div>
            <span className="font-semibold">Join Date:</span><br />
            {selectedStudent.join_date}
          </div>
          <div>
            <span className="font-semibold">Class:</span><br />
            {selectedStudent.student_class}
          </div>
          <div>
            <span className="font-semibold">Province:</span><br />
            {selectedStudent.province}
          </div>
          <div>
            <span className="font-semibold">Address:</span><br />
            {selectedStudent.current_address}
          </div>
          <div>
            <span className="font-semibold">Assas Number:</span><br />
            {selectedStudent.assas_number}
          </div>
          <div className="col-span-full">
            <span className="font-semibold">Details:</span><br />
            {selectedStudent.description}
          </div>
          
        </div>
    </Modal>
  );
}

function AddStudentModal({ isModalOpen, closeModal, setRefresh, setIsModalOpen, selectedStudent }){

      const { register, handleSubmit, reset, control, trigger, setValue, formState: { errors, isSubmitting } } = useForm();
      
      const onSubmit = async (data) => {
          try {
            const flattened = Object.entries(data).reduce((acc, [groupName, groupFields]) => {
              if (typeof groupFields === "object" && groupFields !== null) {
                Object.entries(groupFields).forEach(([key, value]) => {
                  acc[key] = value;
                });
              } else {
                acc[groupName] = groupFields;
              }
              return acc;
            }, {});
            // ✅ Flatten grouped data into one object
            // console.log("📦 Flattened Student Data:", flattened);

            if(selectedStudent){
              toast.success("Under procces the student update")
            }else{
              // ✅ Call API
              const newStudent = await createStudent(flattened);
              const imgName = newStudent.profile?.split("profile/")[1];
              // ✅ Add the new record to your state
              const newRecord = { ...flattened, generated_id: newStudent.generated_id, profile: imgName };
              // console.log(newRecord)
              setRefresh((prev) => !prev);
              toast.success(`${newRecord.generated_id} student record added`);
            }
            reset();
            setIsModalOpen(false);
          } catch (err) {
            if (err?.response?.status === 400 || err.response.status === 500) {
              toast.error(err.response.data.message);
            } else {
              console.error("Failed to create student:", err);
              toast.error(`Failed to create student ${err}`);
            }
          }
      };


    return(
        <Modal onClose={closeModal} containerStyle={'sm'} isOpen={isModalOpen} title={`${selectedStudent ? "Edit":"Add"} Student ${selectedStudent && selectedStudent.generated_id}`} >
          
            <form onSubmit={handleSubmit(onSubmit)}>

              <FieldsResultStepper
                  fields={studentFieldsGroups}
                  register={register}
                  control={control}
                  errors={errors}
                  inputStyle={inputStyle}
                  dropdownStyle={dropdownStyle}
                  labelStyle={labelStyle}
                  trigger={trigger}
                  setValue={setValue} // pass this
                  isSubmitting={isSubmitting}
                  defaultValues={selectedStudent && {profile:{...selectedStudent, students_profile: selectedStudent.profile}, family_info: selectedStudent, address_info: selectedStudent, contact_id: selectedStudent}}
                />

            </form>
        </Modal>
    )
}
