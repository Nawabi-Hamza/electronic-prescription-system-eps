import React, { useState, useEffect, useMemo } from "react";
import { badge, tableStyles as ts } from "../../../styles/componentsStyle";
import { showModalStyle } from "../../../styles/modalStyles";
import { btnStyle, divStyle, inputStyle } from "../../../styles/componentsStyle";
import { Trash, UserPen, Eye, X, Search, PhoneCall, MessageCircle, MessageCircleDashed, MessageCircleMore, UserPenIcon, Section } from "lucide-react";
import { useForm } from "react-hook-form";
import {  updateUserFieldsGroup, userFieldsGroup } from "../../../utils/FormFields";
import ImageViewer from "../../../componenets/ImageViewer";
import { toast } from "react-toastify";
import Modal from "../../../componenets/ModalContainer";
import { ConfirmToast } from "../../../componenets/Toaster";
import Table from "../../../componenets/Table";
// import { deleteStudent, fetchStudents, createStudent, updateStudent } from "../../../api/ownerAPI";
// import FieldsResultStepper from "../../../componenets/FieldsGroupForm";
import { fetchUsers, fetchUsersDetails, createUser, deleteUser } from "../../../api/ownerAPI";
import SectionContainer from "../../../componenets/SectionContainer";
import FieldsGroupForm from "../../../componenets/FieldsGroupForm";

function Doctors() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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

    function handleDelete(id, generated_id){
      ConfirmToast("Are you sure to remove this user?", async()=>{
        try {
            await deleteUser(id);
            setUsers((prev) => prev.filter(user => user.id !== id));
            toast.success(`${generated_id} user record removed successfuly`)
        } catch (error) {
            toast.error(`${generated_id} Delete faild!`)
            console.error("Delete failed:", error);
        }
      })
    };
  

    const [showInfoModal, setShowInfoModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const showUserformation = (user_id) => {
        setSelectedStudent(user_id);
        setShowInfoModal(true);
    };

    const handleEdit = (record)=>{
      setSelectedStudent(record)
      setIsUpdateModalOpen(true)
    }

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
                        altText={`${row.doctor_name}-${row.lastname}`}
                        className="w-10 h-10 rounded-md object-cover"
                      />
                    )},
                    { key: "doctor_name", label: "fullname", render: (val, row) => (val+' '+row.lastname)},
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
                {
                    label: <UserPen size={20} />,
                    className: ts.primaryBtn, 
                    onClick: () =>  handleEdit(row),
                },
                {
                    label: <Trash size={20} />,
                    className: ts.dangerBtn,
                    onClick: () =>  handleDelete(row.id, row.generated_id),
                }
              ]}
      />
      <ShowUserModal showInfoModal={showInfoModal} selectedUser={selectedStudent} closeInfoModal={() => setShowInfoModal(false)} />
      <AddUserModal isModalOpen={isModalOpen} setRefresh={setRefresh} handleClose={() => setIsModalOpen(false)}  />
      <UpdateUserModal isUpdateModalOpen={isUpdateModalOpen} setRefresh={setRefresh} setIsUpdateModalOpen={setIsUpdateModalOpen} selectedUser={selectedStudent} setSelectedUser={setSelectedStudent} />
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



function AddUserModal({ isModalOpen, setRefresh, handleClose }) {
  const { register, handleSubmit, reset, control, trigger, setValue, formState: { errors, isSubmitting } } = useForm();

  /* ================= SUBMIT ================= */
  const onSubmit = async (data) => {
    try {
      const user_data = { ...data.profile, ...data.personal_info, ...data.account_info };

      // console.log("FINAL USER PAYLOAD:", user_data);
      await createUser(user_data);
      setRefresh(p => !p);
      toast.success("User updated successfully");
      reset({})
      handleClose();
    } catch (err) {
      // console.error("❌ user submission failed:", err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  /* ================= RENDER ================= */
  return (
    <Modal onClose={handleClose} containerStyle="sm" isOpen={isModalOpen} title={`Add User`}>
      <FieldsGroupForm
        fields={userFieldsGroup}
        register={register}
        control={control}
        errors={errors}
        trigger={trigger}
        setValue={setValue}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit(onSubmit)}
      />
    </Modal>
  );
}

function UpdateUserModal({
  isUpdateModalOpen,
  setIsUpdateModalOpen,
  setRefresh,
  selectedUser,
  setSelectedUser,
}) {

  
  const {
    register,
    handleSubmit,
    reset,
    control,
    trigger,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {}, // IMPORTANT
  });

  /* ================= DEFAULT VALUES ================= */
  const defaultValues = useMemo(() => {
    if (!selectedUser) return {};

    return {
      profile: {
        doctor_name: selectedUser.doctor_name ?? "",
        lastname: selectedUser.lastname ?? "",
      },
      personal_info: {
        clinic_name: selectedUser.clinic_name ?? "",
        gender: selectedUser.gender ?? "",
        experience_year: selectedUser.experience_year ?? "",
        date_of_birth: selectedUser.date_of_birth ?? "",
        status: selectedUser.status ?? "active",
        calendar_type: selectedUser.calendar_type ?? "miladi",
        clinic_fee: selectedUser.clinic_fee ?? "",
      },
      account_info: {
        phone: selectedUser.phone ?? "",
        email: selectedUser.email ?? "",
      },
    };
  }, [selectedUser]);

  /* ================= RESET FORM WHEN USER CHANGES ================= */
  useEffect(() => {
    if (selectedUser) {
      reset(defaultValues);
    }
  }, [selectedUser, defaultValues, reset]);

  /* ================= SUBMIT ================= */
  const onSubmit = async (data) => {
    try {
      if (!selectedUser?.id) {
        toast.error("Invalid user ID");
        return;
      }

      const payload = {
        ...data.profile,
        ...data.personal_info,
        ...data.account_info,
      };

      console.log("UPDATE PAYLOAD:", payload);

      // ✅ SEND ID
      // await updateUser(selectedUser.id, payload);

      setRefresh((p) => !p);
      toast.success("User updated successfully");
      handleClose();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  const handleClose = () => {
    reset({});
    setSelectedUser(null);
    setIsUpdateModalOpen(false);
  };

  return (
    <Modal
      onClose={handleClose}
      containerStyle="sm"
      isOpen={isUpdateModalOpen}
      title="Edit User"
    >
      <FieldsGroupForm
        fields={updateUserFieldsGroup}
        register={register}
        control={control}
        errors={errors}
        trigger={trigger}
        setValue={setValue}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit(onSubmit)}
      />
    </Modal>
  );
}


// function AddUserModal({ isModalOpen, setRefresh, setIsModalOpen, selectedStudent, setSelectedStudent }) {
// const { register, handleSubmit, reset, control, trigger, setValue, formState: { errors, isSubmitting } } = useForm();

//   useEffect(() => {
//     if (selectedStudent) {
//       reset(defaultValues); // populate form when editing
//     } else {
//       reset(); // clear previous values
//     }
//   }, [selectedStudent, reset]);

//   const onSubmit = async (data) => {
//     try {
//       const { ...rest } = data;
      
//       const user_data = Object.entries(rest).reduce((a, [k, v]) => typeof v === "object" && v !== null ? { ...a, ...v } : { ...a, [k]: v }, {});
//     return console.log(user_data)



//       // selectedStudent
//       // ? await updateStudent(selectedStudent.generated_id, studentData)
//       // :
//        await createUser(user_data);
      
//       setRefresh((p) => !p);
//       toast.success(`${selectedStudent ? "Student updated" : "Student added"} successfully`);
//       reset();
//       setSelectedStudent(false)
//       setIsModalOpen(false);
//     } catch (err) {
//       console.error("❌ doctor submission failed:", err);
//       toast.error(err?.response?.data?.message || err || "Something went wrong");
//     }
//   };

//   // ✅ FINAL FIXED defaultValues structure
//   const defaultValues = selectedStudent && {
//         profile: {
//           students_profile: selectedStudent?.profile || "",
//           firstname: selectedStudent?.firstname || "",
//           lastname: selectedStudent?.lastname || "",
//           date_of_birth: selectedStudent?.date_of_birth || "",
//           gender: selectedStudent?.gender || "",
//           join_date: selectedStudent?.join_date || "",
//           nationality: selectedStudent?.nationality || "",
//           mother_language: selectedStudent?.mother_language || "",
//         },
//         family_info: {
//           father_name: selectedStudent?.father_name || "",
//           grand_father_name: selectedStudent?.grand_father_name || "",
//           father_job: selectedStudent?.father_job || "",
//           brother_name: selectedStudent?.brother_name || "",
//           brother_name2: selectedStudent?.brother_name2 || "",
//           mama_name: selectedStudent?.mama_name || "",
//           kaka_name: selectedStudent?.kaka_name || "",
//           bacha_kaka_name: selectedStudent?.bacha_kaka_name || "",
//           bacha_mama_name: selectedStudent?.bacha_mama_name || "",
//         },
//         contact_id: {
//           phone: selectedStudent?.phone || "",
//           whatsapp_phone: selectedStudent?.whatsapp_phone || "",
//           email: selectedStudent?.email || "",
//           national_id: selectedStudent?.national_id || "",
//           assas_number: selectedStudent?.assas_number || "",
//           description: selectedStudent?.description || "",
//         },
//         address_info: {
//           current_address: {
//             ...selectedStudent?.current_address,
//           },
//           permanent_address: {
//             ...selectedStudent?.permanent_address,
//           },
//         },
//       }
    
//       const handleClose = ()=>{
//         console.log("close model caled")
//         reset()
//         setValue(null)
//         setSelectedStudent(null)
//         setIsModalOpen(false)
//       }
      
//   return (
//     <Modal
//       onClose={handleClose}
//       containerStyle="sm"
//       isOpen={isModalOpen}
//       title={`${selectedStudent ? "Edit" : "Add"} Student ${selectedStudent?.generated_id || ""}`}
//     >

// {/* <FieldsGroupForm
//   fields={[
//     {
//       name: "addresses",
//       type: "array",
//       label: "Doctor Addresses",
//       fields: [
//         { name: "type", type: "select", label: "Country",
//           option: ["Permanent", "Current"]
//          },
//         { name: "country", type: "text", label: "Country" },
//         { name: "city", type: "text", label: "City" },
//         { name: "street", type: "textarea", label: "Street Address" },
//         { name: "floor_number", type: "textarea", label: "Street Address" },
//         { name: "room_number", type: "textarea", label: "Street Address" },
//         { name: "address", type: "textarea", label: "Street Address" },
//       ]
//     }
//   ]}
//   register={register}
//   control={control}
//   errors={errors}
//   setValue={setValue}
// /> */}

//       {/* <form onSubmit={handleSubmit(onSubmit)}> */}
//         <FieldsGroupForm
//           fields={userFieldsGroup}
//           register={register}
//           control={control}
//           errors={errors}
//           trigger={trigger}
//           setValue={setValue}
//           isSubmitting={isSubmitting}
//           defaultValues={selectedStudent && defaultValues }
//           onSubmit={handleSubmit(onSubmit)}
//         />
//       {/* </form> */}
//     </Modal>
//   );
// }



function ShowUserModal({ showInfoModal, selectedUser, closeInfoModal }) {

  const [ user, setUser ] = useState({})
  const loadUsers = async (selectedUser_id) => {
    try {
      await fetchUsersDetails({ seter: setUser, user_id: selectedUser_id});
      // setUsersdata);
    } catch (error) {
      console.error(`Error loading users: ${error.message}`);
      if(error.code==="ERR_NETWORK"){
        toast.error(`Error loading users: ${error.message}`);
      }

    }
  };

  // console.log(user)

  useEffect(() => { loadUsers(selectedUser) }, [selectedUser]);

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
              {user.available_days.map( item => (
                <>
                  <div className="shadow p-4 mb-4">
                    {/* <h3 className="text-sm font-medium text-gray-600 mb-1">Available Days</h3> */}
                    <div className="flex flex-wrap justify-between items-center gap-2">
                        <span className="font-semibold uppercase">{item.day_of_week}</span>
                        <span className={item.status == "open" ? badge.successSm: badge.dangerSm}>{item.status}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex flex-col">
                        <span className="text-gray-500">Start Time</span>
                        <span className="font-medium">
                          {item.in_time || "--"}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-gray-500">End Time</span>
                        <span className="font-medium">
                          {item.out_time || "--"}
                        </span>
                      </div>
                    </div>        
                  </div>
                </>
              ))}
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
