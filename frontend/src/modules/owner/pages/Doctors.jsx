import React, { useState, useEffect, useMemo } from "react";
import { badge, tableStyles as ts } from "../../../styles/componentsStyle";
import { showModalStyle } from "../../../styles/modalStyles";
import { btnStyle, divStyle, inputStyle } from "../../../styles/componentsStyle";
import { Trash, UserPen, Eye, X, Search, PhoneCall, MessageCircle, MessageCircleDashed, MessageCircleMore, UserPenIcon, Section } from "lucide-react";
import { useForm } from "react-hook-form";
import {  userFieldsGroup } from "../../../utils/FormFields";
import ImageViewer from "../../../componenets/ImageViewer";
import { toast } from "react-toastify";
import Modal from "../../../componenets/ModalContainer";
import { ConfirmToast } from "../../../componenets/Toaster";
import Table from "../../../componenets/Table";
// import { deleteStudent, fetchStudents, createStudent, updateStudent } from "../../../api/ownerAPI";
// import FieldsResultStepper from "../../../componenets/FieldsGroupForm";
import { fetchUsers, fetchUsersDetails, createUser } from "../../../api/ownerAPI";
import SectionContainer from "../../../componenets/SectionContainer";
import FieldsGroupForm from "../../../componenets/FieldsGroupForm";

function Doctors() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // const { reset } = useForm();
  const [refresh,setRefresh] = useState(false)

  // Fetch Users
  const loadUsers = async () => {
    try {
      await fetchUsers({ seter: setUsers});
    } catch (error) {
      console.error(`Error loading students: ${error.message}`);
      if(error.code==="ERR_NETWORK"){
        toast.error(`Error loading students: ${error.message}`);
      }

    }
  };

  useEffect(() => { loadUsers() }, [refresh]);

  // function handleDelete(id){
  //   ConfirmToast("Are you sure to remove this student?", async()=>{
  //     try {
  //         await deleteStudent(id);
  //         setStudents((prevStudents) => prevStudents.filter(student => student.generated_id !== id));
  //         toast.success(`${id} student record removed successfuly`)
  //     } catch (error) {
  //         toast.error(`${id} Delete faild!`)
  //         console.error("Delete failed:", error);
  //     }
  //   })
  // };
  

    const [showInfoModal, setShowInfoModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const showUserformation = (user_id) => {
        setSelectedStudent(user_id);
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
  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return users?.filter((s) => 
      s.generated_id?.toLowerCase().includes(term) ||
      (s.doctor_name)?.toLowerCase().includes(term) ||
      s.clinic_name?.toLowerCase().includes(term) ||
      s.email?.toLowerCase().includes(term) ||
      s.phone?.toLowerCase().includes(term)
    )
  }, [users, searchTerm]);

  return (
    <div>
      <h1 className="text-2xl mb-4 font-semibold">Doctors Management</h1>
      <HeaderSection setSelectedStudent={setSelectedStudent} searchTerm={searchTerm} setSearchTerm={setSearchTerm} setIsModalOpen={setIsModalOpen} /><br />
      <Table
            columns={[
                    { key: "generated_id", label: "ID" },
                    { key: "photo", label: "profile", render: (val, row) => (
                      <ImageViewer
                        imagePath={`/uploads/profiles/${val}`}
                        altText={`${row.firstname}`}
                        className="w-10 h-10 rounded-md object-cover"
                      />
                    )},
                    { key: "doctor_name", label: "fullname"},
                    { key: "clinic_name", label: "Clinic"},
                    { key: "phone", label: "Phone" },
                    { key: "status", label: "status", render: (val) => (<span className="uppercase">{val}</span>) },
                ]}
            records={filteredUsers}
            actions={(row) => [
                {
                    label: <Eye size={20} />,
                    className: ts.primaryBtn,
                    onClick: () =>  showUserformation(row.id),
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
                    // onClick: () =>  handleDelete(row.generated_id),
                }
                
              ]}
      />
      <ShowUserModal showInfoModal={showInfoModal} selectedStudent={selectedStudent} closeInfoModal={closeInfoModal} />
      <AddUserModal selectedStudent={selectedStudent} isModalOpen={isModalOpen} setRefresh={setRefresh} setIsModalOpen={setIsModalOpen} setSelectedStudent={setSelectedStudent} />
    </div>
  )
}

export default Doctors





function HeaderSection({ searchTerm, setSearchTerm, setIsModalOpen, setSelectedStudent}){
    return(<div className={divStyle.betweenResponsiveReverse}>
        <div className="relative w-full">
          <Search className={inputStyle.searchIcon} />
          <input
            type="text"
            className={inputStyle.primary}
            placeholder="Search Doctors by ID, Username, Email, Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={() => {
            setSelectedStudent(null)
            setIsModalOpen(true)
            }} className={btnStyle.filled}>
          + Add Doctor
        </button>
      </div>)
}


function AddUserModal({ isModalOpen, setRefresh, setIsModalOpen, selectedStudent, setSelectedStudent }) {
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
      const { ...rest } = data;
      
      const user_data = Object.entries(rest).reduce((a, [k, v]) => typeof v === "object" && v !== null ? { ...a, ...v } : { ...a, [k]: v }, {});
    // return console.log(user_data)



      // selectedStudent
      // ? await updateStudent(selectedStudent.generated_id, studentData)
      // :
       await createUser(user_data);
      
      setRefresh((p) => !p);
      toast.success(`${selectedStudent ? "Student updated" : "Student added"} successfully`);
      reset();
      setSelectedStudent(false)
      setIsModalOpen(false);
    } catch (err) {
      console.error("❌ doctor submission failed:", err);
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

{/* <FieldsGroupForm
  fields={[
    {
      name: "addresses",
      type: "array",
      label: "Doctor Addresses",
      fields: [
        { name: "type", type: "select", label: "Country",
          option: ["Permanent", "Current"]
         },
        { name: "country", type: "text", label: "Country" },
        { name: "city", type: "text", label: "City" },
        { name: "street", type: "textarea", label: "Street Address" },
        { name: "floor_number", type: "textarea", label: "Street Address" },
        { name: "room_number", type: "textarea", label: "Street Address" },
        { name: "address", type: "textarea", label: "Street Address" },
      ]
    }
  ]}
  register={register}
  control={control}
  errors={errors}
  setValue={setValue}
/> */}

      {/* <form onSubmit={handleSubmit(onSubmit)}> */}
        <FieldsGroupForm
          fields={userFieldsGroup}
          register={register}
          control={control}
          errors={errors}
          trigger={trigger}
          setValue={setValue}
          isSubmitting={isSubmitting}
          defaultValues={selectedStudent && defaultValues }
          onSubmit={handleSubmit(onSubmit)}
        />
      {/* </form> */}
    </Modal>
  );
}



function ShowUserModal({ showInfoModal, selectedStudent, closeInfoModal }) {
  // if (!showInfoModal || !selectedStudent) return null;
  const [ user, setUser ] = useState({})
  const loadUsers = async (selectedStudent_id) => {
    try {
      await fetchUsersDetails({ seter: setUser, user_id: selectedStudent_id});
      // setUsersdata);
    } catch (error) {
      console.error(`Error loading users: ${error.message}`);
      if(error.code==="ERR_NETWORK"){
        toast.error(`Error loading users: ${error.message}`);
      }

    }
  };

  // console.log(user)

  useEffect(() => { loadUsers(selectedStudent) }, [selectedStudent]);

  return (
    <Modal isOpen={showInfoModal} containerStyle="sm" onClose={closeInfoModal} title={`Doctor - ${user.doctor_name}`}>
      {/* Top row: Picture + main info */}

        {/* Horizontal info next to picture */}
        <div className={showModalStyle.headerContainer+" shadow rounded-md mb-6 p-4"}>
          {/* Picture */}
            <ImageViewer
                imagePath={`/uploads/profiles/${user.photo}`}
                altText={`${user.doctor_name}`}
                className={showModalStyle.image+ " max-h-40 w-auto"}
            />
          <div className={showModalStyle.headerContent}>
            {/* Each info item with fixed min width for alignment */}
              <div className="min-w-[180px]">
                <span className="font-semibold block">ID:</span>
                {user.generated_id}
              </div>
              <div className="min-w-[180px]">
                <span className="font-semibold block">Full Name:</span>
                {user.doctor_name}
              </div>
              <div className="min-w-[180px]">
                <span className="font-semibold block">Clinic:</span>
                {user.clinic_name}
              </div>
              <div className="min-w-[180px]">
                <span className="font-semibold block">Email:</span>
                {user.email}
              </div>
              <div className="min-w-[180px]">
                <span className="font-semibold block">Phone:</span>
                <div>
                  <span className="flex gap-1 items-center">
                    <PhoneCall size={15} /> {user.phone}
                  </span>
                  {/* <span className="flex gap-1 items-center">
                    <MessageCircleMore size={15} /> {user.whatsapp_phone}
                  </span> */}
                </div>
              </div>
          </div>
        </div>

        {/* Bottom grid: other info in up to 3 columns */}
        <div className={'space-y-4'}>
          <SectionContainer title="Doctor Details">
            <div className="col-span-full  md:p-6  grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* USER ID */}
              <div>
                <p className="text-xs text-gray-500 uppercase">User ID</p>
                <p className="text-sm font-semibold">{user.generated_id}</p>
              </div>

              {/* CLINIC NAME */}
              <div>
                <p className="text-xs text-gray-500 uppercase">Clinic Name</p>
                <p className="text-sm font-semibold">{user.clinic_name}</p>
              </div>

              {/* CLINIC FEE */}
              <div>
                <p className="text-xs text-gray-500 uppercase">Clinic Fee</p>
                <p className="text-sm font-semibold">{user.clinic_fee}</p>
              </div>

              {/* DOB */}
              <div>
                <p className="text-xs text-gray-500 uppercase">Date of Birth</p>
                <p className="text-sm font-semibold">
                  {user.date_of_birth?.split("T")[0] || "--"}
                </p>
              </div>

              {/* CALENDAR TYPE */}
              <div>
                <p className="text-xs text-gray-500 uppercase">Calendar Type</p>
                <span
                  className={`${badge.primarySm} text-xs font-semibold uppercase inline-block mt-1`}
                >
                  {user.calendar_type}
                </span>
              </div>

              {/* STATUS */}
              <div>
                <p className="text-xs text-gray-500 uppercase">Status</p>
                <span
                  className={`text-xs font-semibold capitalize inline-block mt-1 ${
                    user.status === "active" ? badge.successSm : badge.dangerSm
                  }`}
                >
                  {user.status}
                </span>
              </div>

              {/* GENDER */}
              <div>
                <p className="text-xs text-gray-500 uppercase">Gender</p>
                <p className="text-sm font-semibold capitalize">{user.gender}</p>
              </div>

              {/* JOIN DATE */}
              <div>
                <p className="text-xs text-gray-500 uppercase">Join Date</p>
                <p className="text-sm font-semibold">
                  {user.join_date?.split("T")[0] || "--"}
                </p>
              </div>

              {/* EXPERIENCE */}
              <div>
                <p className="text-xs text-gray-500 uppercase">Experience</p>
                <p className="text-sm font-semibold">{user.experience_year} Years</p>
              </div>

            </div>
          </SectionContainer>
           
          {user?.addresses?.length > 0 && (
            <SectionContainer title="Addresses">
                {user.addresses.map((add, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold uppercase text-gray-700">
                        📍 {add.type}
                      </span>
                    </div>

                    <div className="text-sm text-gray-700 space-y-1">
                      <div className="capitalize">
                        {add.country} / {add.province} / {add.district} / {add.address}
                      </div>

                      {(add.floor_number || add.room_number) && (
                        <div>
                          <span className="font-medium">
                            Floor:
                          </span>{" "}
                          {add.floor_number || "--"}{" "}
                          <span className="font-medium ml-4">
                            Room:
                          </span>{" "}
                          {add.room_number || "--"}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </SectionContainer>
          )}

          {user?.specializations?.length > 0 && (
            <SectionContainer title="Specializations">
              {user.specializations.map((sp, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-gray-800">
                        {sp.specialization_name}
                      </span>

                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          sp.status === "active"
                            ? badge.successSm
                            : badge.dangerSm
                        }`}
                      >
                        {sp.status}
                      </span>
                    </div>

                    {sp.specialization_description && (
                      <p className="text-sm text-gray-600">
                        {sp.specialization_description}
                      </p>
                    )}
                  </div>
                ))}
            </SectionContainer>
          )}

          {user?.available_days?.length > 0 && (
            <SectionContainer title="Available Days">

              <div>
                {/* <h3 className="text-sm font-medium text-gray-600 mb-1">Available Days</h3> */}
                <div className="flex flex-wrap gap-2">

                  {Object.entries(user.available_days[0])
                    .filter(([key]) =>
                      ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"].includes(key) 
                    // && value == 1
                    )
                    .map(([day,v]) => (
                      <span
                        key={day}
                        className={v ? badge.successSm:badge.dangerSm}
                      >
                        {day.charAt(0).toUpperCase() + day.slice(1)} 
                      </span>
                    ))
                  }

                </div>
              </div>

              {/* Timings */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex flex-col">
                  <span className="text-gray-500">Start Time</span>
                  <span className="font-medium">
                    {user.available_days[0].in_time || "--"}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-gray-500">End Time</span>
                  <span className="font-medium">
                    {user.available_days[0].out_time || "--"}
                  </span>
                </div>
              </div>
            </SectionContainer>
          )}
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
