import React, { useState, useEffect, useMemo } from "react";
import { tableStyles as ts } from "../../../styles/componentsStyle";
import { showModalStyle } from "../../../styles/modalStyles";
import { btnStyle, divStyle, gridStyle, inputStyle } from "../../../styles/componentsStyle";
import { Trash, UserPen, Eye, X, Search, PhoneCall, MessageCircle, MessageCircleDashed, MessageCircleMore, UserPenIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { studentFieldsGroups } from "../../../utils/FormFields";
import ImageViewer from "../../../componenets/ImageViewer";
import { toast } from "react-toastify";
import Modal from "../../../componenets/ModalContainer";
import { ConfirmToast } from "../../../componenets/Toaster";
import Table from "../../../componenets/Table";
import { deleteStudent, fetchStudents, createStudent, updateStudent } from "../../../api/adminAPI";
import FieldsResultStepper from "../../../componenets/FieldsGroupStepper";

const Students = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // const { reset } = useForm();
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
    // const closeModal = () => {
    //     setSelectedStudent(null)
    //     setIsModalOpen(false);
    // };

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
    <HeaderSection setSelectedStudent={setSelectedStudent} searchTerm={searchTerm} setSearchTerm={setSearchTerm} setIsModalOpen={setIsModalOpen} /><br />
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
                  { key: "firstname", label: "fullname", render: (val, row) => ( row?.firstname + " " + row?.lastname)},
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
              row?.status?.includes("active") &&
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
    <AddStudentModal selectedStudent={selectedStudent} isModalOpen={isModalOpen} setRefresh={setRefresh} setIsModalOpen={setIsModalOpen} setSelectedStudent={setSelectedStudent} />
    </>
  );
};

export default Students;

function HeaderSection({ searchTerm, setSearchTerm, setIsModalOpen, setSelectedStudent}){
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
        <button onClick={() => {
            setSelectedStudent(null)
            setIsModalOpen(true)
            }} className={btnStyle.filled}>
          + Add Student
        </button>
      </div>)
}


function AddStudentModal({ isModalOpen, setRefresh, setIsModalOpen, selectedStudent, setSelectedStudent }) {
  const { register, handleSubmit, reset, control, trigger, setValue, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    if (selectedStudent) {
      reset(defaultValues); // populate form when editing
    } else {
      reset(); // clear previous values
    }
  }, [selectedStudent, reset]);

  const onSubmit = async (data) => {
    try {
      const { address_info, ...rest } = data;

      const studentData = Object.entries(rest).reduce((a, [k, v]) =>
        typeof v === "object" && v !== null ? { ...a, ...v } : { ...a, [k]: v }, {}
      );

      // flatten address info
      studentData.current_address = JSON.stringify(address_info?.current_address || {});
      studentData.permanent_address = JSON.stringify(address_info?.permanent_address || {});

      selectedStudent
      ? await updateStudent(selectedStudent.generated_id, studentData)
      : await createStudent(studentData);
      
      setRefresh((p) => !p);
      toast.success(`${selectedStudent ? "Student updated" : "Student added"} successfully`);
      reset();
      setSelectedStudent(false)
      setIsModalOpen(false);
    } catch (err) {
      console.error("❌ Student submission failed:", err);
      toast.error(err?.response?.data?.message || err || "Something went wrong");
    }
  };

  // ✅ FINAL FIXED defaultValues structure
  const defaultValues = selectedStudent && {
        profile: {
          students_profile: selectedStudent?.profile || "",
          firstname: selectedStudent?.firstname || "",
          lastname: selectedStudent?.lastname || "",
          date_of_birth: selectedStudent?.date_of_birth || "",
          gender: selectedStudent?.gender || "",
          join_date: selectedStudent?.join_date || "",
          nationality: selectedStudent?.nationality || "",
          mother_language: selectedStudent?.mother_language || "",
        },
        family_info: {
          father_name: selectedStudent?.father_name || "",
          grand_father_name: selectedStudent?.grand_father_name || "",
          father_job: selectedStudent?.father_job || "",
          brother_name: selectedStudent?.brother_name || "",
          brother_name2: selectedStudent?.brother_name2 || "",
          mama_name: selectedStudent?.mama_name || "",
          kaka_name: selectedStudent?.kaka_name || "",
          bacha_kaka_name: selectedStudent?.bacha_kaka_name || "",
          bacha_mama_name: selectedStudent?.bacha_mama_name || "",
        },
        contact_id: {
          phone: selectedStudent?.phone || "",
          whatsapp_phone: selectedStudent?.whatsapp_phone || "",
          email: selectedStudent?.email || "",
          national_id: selectedStudent?.national_id || "",
          assas_number: selectedStudent?.assas_number || "",
          description: selectedStudent?.description || "",
        },
        address_info: {
          current_address: {
            ...selectedStudent?.current_address,
          },
          permanent_address: {
            ...selectedStudent?.permanent_address,
          },
        },
      }
    
      const handleClose = ()=>{
        console.log("close model caled")
        reset()
        setValue(null)
        setSelectedStudent(null)
        setIsModalOpen(false)
      }
      
  return (
    <Modal
      onClose={handleClose}
      containerStyle="sm"
      isOpen={isModalOpen}
      title={`${selectedStudent ? "Edit" : "Add"} Student ${selectedStudent?.generated_id || ""}`}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldsResultStepper
          fields={studentFieldsGroups}
          register={register}
          control={control}
          errors={errors}
          trigger={trigger}
          setValue={setValue}
          isSubmitting={isSubmitting}
          defaultValues={selectedStudent && defaultValues }
          handleSubmit={handleSubmit(onSubmit)}
        />
      </form>
    </Modal>
  );
}





function ShowStudentModal({ showInfoModal, selectedStudent, closeInfoModal }) {
  if (!showInfoModal || !selectedStudent) return null;
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
            <span className="font-semibold">National ID:</span><br />
            {selectedStudent.national_id}
          </div>
          <div>
            <span className="font-semibold">Class:</span><br />
            {selectedStudent.student_class}
          </div>
          <div>
            <span className="font-semibold">DOB:</span><br />
            {selectedStudent.date_of_birth?.split('T')[0]}
          </div>
          <div>
            <span className="font-semibold">Gender:</span><br />
            <span className="capitalize">
              {selectedStudent.gender}
            </span>
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
            <span className="font-semibold">Nationality:</span><br />
            {selectedStudent.nationality}
          </div>        
          <div>
            <span className="font-semibold">Mother Language:</span><br />
            {selectedStudent.mother_language}
          </div>
          <div>
            <span className="font-semibold">Assas Number:</span><br />
            {selectedStudent.assas_number}
          </div>
          <div className="col-span-full">
            <span className="font-semibold">Details:</span><br />
            {selectedStudent.description}
          </div>
          <hr className="my-6 col-span-full border-gray-300 overflow-y-auto" />
          <div className="col-span-full">
            <span className="font-semibold">📍 Main Address:</span><br />
            {selectedStudent?.current_address?.country} / {selectedStudent?.current_address?.province} / {selectedStudent?.current_address?.district} / {selectedStudent?.current_address?.home_address}
          </div>
          <div className="col-span-full">
            <span className="font-semibold">📍 Current Address:</span><br />
            {selectedStudent?.permanent_address?.country} / {selectedStudent?.permanent_address?.province} / {selectedStudent?.permanent_address?.district} / {selectedStudent?.permanent_address?.home_address}
          </div>
          
        </div>
    </Modal>
  );
}




// function AddStudentModal({ isModalOpen, closeModal, setRefresh, setIsModalOpen, selectedStudent }) {
//   const { register, handleSubmit, reset, control, trigger, setValue, formState: { errors, isSubmitting } } = useForm();

//   useEffect(() => {
//     if (!selectedStudent) {
//       reset(); // clear previous values
//     }
//   }, [selectedStudent, reset]);

//   const onSubmit = async (data) => {
//     try {
//       const { current_address, permanent_address, ...rest } = data;

//       // Flatten other fields
//       const studentData = Object.entries(rest).reduce((a, [k, v]) =>
//         typeof v === "object" && v !== null ? { ...a, ...v } : { ...a, [k]: v }, {}
//       );

//       // Stringify addresses for backend
//       studentData.current_address = JSON.stringify(current_address || {});
//       studentData.permanent_address = JSON.stringify(permanent_address || {});

//       const response = selectedStudent
//         ? await updateStudent(selectedStudent.generated_id, studentData)
//         : await createStudent(studentData);

//       // console.log(response)
//       setRefresh(p => !p);
//       toast.success(`${selectedStudent ? "Student updated" : "Student added"} successfully`);

//       reset();
//       setIsModalOpen(false);
//     } catch (err) {
//       console.error("❌ Student submission failed:", err);
//       toast.error(err?.response?.data?.message || err || "Something went wrong");
//     }
//   };

//   console.log(selectedStudent)
//   // Prepare default values for edit
//  // ✅ Fixed defaultValues section
// const defaultValues = selectedStudent
//   ? {
//       profile: {
//         ...(selectedStudent || {}),
//         students_profile: selectedStudent?.profile || "",
//       },
//       family_info: selectedStudent || {},
//       contact_id: selectedStudent || {},
//       address_info: {
//         current_address: selectedStudent?.current_address || {},
//         permanent_address: selectedStudent?.permanent_address || {}, // ✅ fixed
//       },
//     }
//   : {
//       profile: {},
//       family_info: {},
//       contact_id: {},
//       address_info: {
//         current_address: {},
//         permanent_address: {},
//       },
//     };

//   return (
//     <Modal
//       onClose={closeModal}
//       containerStyle="sm"
//       isOpen={isModalOpen}
//       title={`${selectedStudent ? "Edit" : "Add"} Student ${selectedStudent?.generated_id || ""}`}
//     >
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <FieldsResultStepper
//           fields={studentFieldsGroups}
//           register={register}
//           control={control}
//           errors={errors}
//           trigger={trigger}
//           setValue={setValue}
//           isSubmitting={isSubmitting}
//           defaultValues={defaultValues}
//           handleSubmit={handleSubmit(onSubmit)}
//         />
//       </form>
//     </Modal>
//   );
// }
