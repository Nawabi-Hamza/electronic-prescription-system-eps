import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Search, SquarePen, X } from "lucide-react";
import { btnStyle, cardStyle, divStyle, dropdownStyle, flexStyle, gridStyle, inputStyle, labelStyle } from "../../../styles/componentsStyle";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { fetchClasses, createClass, fetchFees, updateClass } from "../../../api/adminAPI";
import { classFields } from "../../../utils/FormFields";
import Modal from "../../../componenets/ModalContainer";
import { FormatTimeHHMM } from "../../../componenets/Date&Time";


const Classes = () => {
    const [classes, setClasses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleEdit = (cls) => {
      setSelectedClass(cls);
      setIsEditModalOpen(true);
    };
    const { reset } = useForm();
    
    const closeModal = () => {
        reset();
        setIsModalOpen(false);
        setIsEditModalOpen(false);
    };

    useEffect(() => { fetchClasses({ seter: setClasses }) }, []);

  // filter by name or code
  const filteredClasses = useMemo(()=>{
    const term = searchTerm.toLowerCase()
    return classes.filter((cls) =>
        (`${cls.class_name} ${cls.class_code} ${cls.room_number}`).toLowerCase().includes(term)
      )
  }, [classes, searchTerm]);

  return (
    <>
      <HeaderSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} setIsModalOpen={setIsModalOpen} />
      <CardClasses filteredClasses={filteredClasses} handleEdit={handleEdit} />
      <AddClassModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} closeModal={closeModal} setClasses={setClasses} />
      <EditClassModal isModalOpen={isEditModalOpen} setIsModalOpen={setIsEditModalOpen} selectedClass={selectedClass} closeModal={closeModal} setClasses={setClasses} />
    </>
  );
}



function HeaderSection({ searchTerm, setSearchTerm, setIsModalOpen}){
    return(
      <div className={divStyle.betweenResponsiveReverse}>
        <div className="relative w-full">
          <Search className={inputStyle.searchIcon} />
          <input
            type="text"
            className={inputStyle.primary}
            placeholder="Search class by: Name, Code, Room Number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={() => setIsModalOpen(true)} className={btnStyle.filled}>
          + Create Class
        </button>
      </div>)
}

function CardClasses({ filteredClasses, handleEdit}){
  const navigate = useNavigate();
  return(
      <div className={gridStyle.item4atRowNoScroll}>
        {filteredClasses.length > 0 ? (
          filteredClasses.map((cls) => (
            <div
              key={cls.class_id}
              onClick={() => navigate(`/admin/classes/${cls.class_id}`)}
              className={cardStyle.cardContainer}
            >
            <div className={`${flexStyle.between} mb-2 border-b-1 border-gray-200`}>
                <h1 className="text-2xl font-bold text-gray-600">
                    {cls.class_code}
                </h1>
                <SquarePen className="h-6 w-6 text-sky-600" onClick={(e)=> {
                    e.stopPropagation();
                    handleEdit(cls)
                  }} />
            </div>
              <div className={`${flexStyle.between} mb-2`}>
                <p className="text-sm font-bold">Start: {FormatTimeHHMM(cls.start_timing)}</p>
                <p className="text-sm font-bold">End: {FormatTimeHHMM(cls.end_timing)}</p>
              </div>
              <p className="text-sm">Class: {cls.class_name}</p>
              <p className="text-sm">Room Number: {cls.room_number}</p>
              <p className="text-sm">Capacity: {cls.class_capacity}</p>
              <p className="text-sm">Enrolled: <span className={cls.class_capacity>=cls.student_count ? "text-green-400":"text-red-400"}>{cls.student_count}</span></p>
              <p className="text-sm">Fee: {cls.class_fee}-AF</p>
              <p className="text-md">
                Status:{" "}
                <span
                  className={
                    cls.class_status === "Inactive"
                      ? "text-red-400"
                      : cls.class_status === "Active" ? "text-sky-400" : "text-green-400"
                  }
                >
                  {cls.class_status}
                </span>
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No classes found</p>
        )}
      </div>
  )
}


function EditClassModal({ isModalOpen, closeModal, setIsModalOpen, setClasses, selectedClass }) {
  // console.log(selectedClass)
  const [fees, setFees] = useState([]);
  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => { fetchFees({ seter: setFees }) }, []);

  useEffect(() => {
    if (selectedClass) {
      reset({
        class_name: selectedClass.class_name || "",
        class_code: selectedClass.class_code,
        class_status: selectedClass.class_status,
        room_number: selectedClass.room_number,
        start_timing: selectedClass.start_timing,
        end_timing: selectedClass.end_timing,
        class_fee: selectedClass.class_fee,
        class_capacity: selectedClass.class_capacity,
      });
    }
  }, [selectedClass, reset]);
  // Watch the selected fee
  const selectedFeeId = watch("class_name"); // use class_name as dropdown

  useEffect(() => {
    if (selectedFeeId) {
      const fee = fees.find(f => f.id === parseInt(selectedFeeId));
      if (fee) setValue("class_fee", fee.fee); // fill class_fee from fee
    } else {
      setValue("class_fee", "");
    }
  }, [selectedFeeId, fees, setValue]);

    const onSubmit = async (data) => {
      if (!selectedClass?.class_id) return;

      try {
        const res = await updateClass(selectedClass.class_id, data);

        // update the class list properly
        setClasses((prev) =>
          prev.map((cls) =>
            cls.class_id === selectedClass.class_id
              ? { ...cls, ...data } // merge updated fields
              : cls
          )
        );

        toast.success(res?.message || "Class updated successfully");
        reset();
        setIsModalOpen(false);
      } catch (err) {
        if (err?.response?.status === 400) {
          toast.error(err?.response?.data?.message);
        } else {
          toast.error("Failed to update class: " + (err?.response?.data?.message || err.message));
        }
      }
    };


  return (
    <Modal isOpen={isModalOpen} containerStyle="sm" onClose={closeModal} title={`Edit Class ${selectedClass?.class_code}`}>
      <form onSubmit={handleSubmit(onSubmit)} className={gridStyle.item3atRow}>

        {/* Class dropdown from fees */}
        <div className="flex flex-col px-2">
          <label htmlFor="class_name" className={labelStyle.primary}>Class Name</label>
          <select
            id="class_name"
            className={`${dropdownStyle.base} ${dropdownStyle.withIcon}`}
            {...register("class_name", { required: "Class is required" })}
          >
            <option value="">Select Class</option>
            {fees.toReversed().map(f => (
              <option key={f.id} value={f.id} defaultValue={f?.class == selectedClass?.class_name && selectedClass.class_name} >
                {f.class} {/* show name from fees table */}
              </option>
            ))}
          </select>
          {errors.class_name && (
            <p className="text-red-500 text-sm mt-1">{errors.class_name.message}</p>
          )}
        </div>

        {/* Other fields including class_fee */}
        {classFields.map((field) => (
          <div key={field.name} className="flex flex-col px-2">
            <label htmlFor={field.name} className={labelStyle.primary}>{field.label}</label>

            {field.type === "select" ? (
              <select
                id={field.name}
                className={`${dropdownStyle.base} ${dropdownStyle.withIcon}`}
                {...register(field.name, field.validation)}
              >
                <option value="">Select {field.label}</option>
                {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            ) : (
              <input
                id={field.name}
                type={field.type}
                placeholder={field.label}
                className={inputStyle.primary}
                {...register(field.name, field.validation)}
                defaultValue={field.defaultValue}
                readOnly={field.name === "class_fee"} // class_fee auto-filled
              />
            )}

            {errors[field.name] && (
              <p className="text-red-500 text-sm mt-1">{errors[field.name].message}</p>
            )}
          </div>
        ))}

        {/* Submit */}
        <div className="col-span-full flex justify-end mt-4">
          <button type="submit" disabled={isSubmitting} className={btnStyle.filled}>
            {isSubmitting ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={closeModal} className={`${btnStyle.secondary} ml-2`} disabled={isSubmitting}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

function AddClassModal({ isModalOpen, closeModal, setClasses, setIsModalOpen }) {
  const [fees, setFees] = useState([]);
  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => { fetchFees({ seter: setFees }) }, []);
  // Watch the selected fee
  const selectedFeeId = watch("class_name"); // use class_name as dropdown

  useEffect(() => {
    if (selectedFeeId) {
      const fee = fees.find(f => f.id === parseInt(selectedFeeId));
      if (fee) setValue("class_fee", fee.fee); // fill class_fee from fee
    } else {
      setValue("class_fee", "");
    }
  }, [selectedFeeId, fees, setValue]);

  const onSubmit = async (data) => {
    try {
      const newClass = await createClass(data);
      setClasses((prev) => [ { ...data, class_id: newClass.class_id }, ...prev]);
      toast.success(newClass.message);
      reset();
      setIsModalOpen(false);
    } catch (err) {
      if (err?.response?.status === 400) toast.error(err?.response?.data?.message);
      else toast.error("Failed to create class: " + err?.response?.data?.message);
    }
  };

  return (
    <Modal isOpen={isModalOpen} containerStyle="sm" onClose={closeModal} title="Create New Class">
      <form onSubmit={handleSubmit(onSubmit)} className={gridStyle.item3atRow}>

        {/* Class dropdown from fees */}
        <div className="flex flex-col px-2">
          <label htmlFor="class_name" className={labelStyle.primary}>Class Name</label>
          <select
            id="class_name"
            className={`${dropdownStyle.base} ${dropdownStyle.withIcon}`}
            {...register("class_name", { required: "Class is required" })}
          >
            <option value="">Select Class</option>
            {fees.toReversed().map(f => (
              <option key={f.id} value={f.id}>
                {f.class} {/* show name from fees table */}
              </option>
            ))}
          </select>
          {errors.class_name && (
            <p className="text-red-500 text-sm mt-1">{errors.class_name.message}</p>
          )}
        </div>

        {/* Other fields including class_fee */}
        {classFields.map((field) => (
          <div key={field.name} className="flex flex-col px-2">
            <label htmlFor={field.name} className={labelStyle.primary}>{field.label}</label>

            {field.type === "select" ? (
              <select
                id={field.name}
                className={`${dropdownStyle.base} ${dropdownStyle.withIcon}`}
                {...register(field.name, field.validation)}
              >
                <option value="">Select {field.label}</option>
                {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            ) : (
              <input
                id={field.name}
                type={field.type}
                placeholder={field.label}
                className={inputStyle.primary}
                {...register(field.name, field.validation)}
                defaultValue={field.defaultValue}
                readOnly={field.name === "class_fee"} // class_fee auto-filled
              />
            )}

            {errors[field.name] && (
              <p className="text-red-500 text-sm mt-1">{errors[field.name].message}</p>
            )}
          </div>
        ))}

        {/* Submit */}
        <div className="col-span-full flex justify-end mt-4">
          <button type="submit" disabled={isSubmitting} className={btnStyle.filled}>
            {isSubmitting ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={closeModal} className={`${btnStyle.secondary} ml-2`} disabled={isSubmitting}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}




// function AddClassModal({ isModalOpen, closeModal, setClasses, setIsModalOpen }) {
//   const [fees,setFees] = useState([])
//   const { register, handleSubmit, reset, formState: { errors, isSubmitting }, } = useForm();
//   useEffect(() => { fetchFeeById({ seter: setFees }) }, []);

//   const onSubmit = async (data) => {
//     try {
//       const newClass = await createClass(data);
//       setClasses((prev) => [...prev, {...data, class_id: newClass.class_id}]);
//       toast.success(newClass.message);
//       reset();
//       setIsModalOpen(false);
//     } catch (err) {
//       if (err?.response?.status === 400) {
//         toast.error(err.response.data.message);
//       } else {
//         console.error("Failed to create class:", err.message);
//         toast.error("Failed to create class: "+err.response.data.message)
//       }
//     }
//   };

//   return (
//     <Modal isOpen={isModalOpen} containerStyle="sm" onClose={closeModal} title="Create New Class">
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className={gridStyle.item3atRow}
//         >
//           {classFields.map((field) => (
//             <div key={field.name} className="flex flex-col px-2">
//               <label htmlFor={field.name} className={labelStyle.primary}>
//                 {field.label}
//               </label>

//               {field.type === "select" ? (
//                 <select
//                   id={field.name}
//                   className={`${dropdownStyle.base} ${dropdownStyle.withIcon}`}
//                   {...register(field.name, field.validation)}
//                 >
//                   <option value="">Select {field.label}</option>
//                   {field.options.map((opt) => (
//                     <option key={opt} value={opt}>
//                       {opt}
//                     </option>
//                   ))}
//                 </select>
//               ) : (
//                 <input
//                   id={field.name}
//                   type={field.type}
//                   placeholder={field.label}
//                   className={inputStyle.primary}
//                   {...register(field.name, field.validation)}
//                   defaultValue={field.defaultValue}
//                 />
//               )}

//               {errors[field.name] && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors[field.name].message}
//                 </p>
//               )}
//             </div>
//           ))}

//           {/* Submit */}
//           <div className="col-span-full flex justify-end mt-4">
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className={btnStyle.filled}
//             >
//               {isSubmitting ? "Saving..." : "Save"}
//             </button>
//             <button
//               type="button"
//               onClick={closeModal}
//               className={`${btnStyle.secondary} ml-2`}
//               disabled={isSubmitting}
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//     </Modal>
//   );
// }





export default Classes;