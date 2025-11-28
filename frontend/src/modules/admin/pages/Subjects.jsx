import React, { useEffect, useMemo, useState } from "react";
import { Pencil, Search, Trash2 } from "lucide-react";
import { btnStyle, cardStyle, divStyle, flexStyle, gridStyle, inputStyle, labelStyle } from "../../../styles/componentsStyle";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Modal from "../../../componenets/ModalContainer";
import { createSubject, deleteSubject, getSubjects, updateSubject } from "../../../api/adminAPI";
import { ConfirmToast } from "../../../componenets/Toaster";


const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { reset } = useForm();
  
  const closeModal = () => {
        reset();
        setIsModalOpen(false);
        setIsEditModalOpen(false)
    };

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getSubjects();
        setSubjects(data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const handleEdite = async (data)=>{
      setSelectedSubject(data) 
      setIsEditModalOpen(true)
    }

  // filter by name or code
  const filteredSubjects = useMemo(() => {
    const term = searchTerm.toLowerCase()
    return subjects.filter((cls) =>
      (`${cls.subject_name} ${cls.subject_code}`).toLowerCase().includes(term)
    )
  }, [subjects, searchTerm]);

  return (
    <>
      {/* 🔎 Search box */}
      <HeaderSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} setIsModalOpen={setIsModalOpen} />
      {/* Show Subjects In Cards */}
      <CardSubjects filteredSubjects={filteredSubjects} onEdit={handleEdite} setSubjects={setSubjects} />
      {/* Add New Subject */}
      <AddSubjectModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} closeModal={closeModal} setSubjects={setSubjects} />
      {/* Edit Subjects */}
      <EditSubjectModal isModalOpen={isEditModalOpen} subject={selectedSubject} closeModal={closeModal} setSubjects={setSubjects} />
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
            placeholder="Search subject by: Name, Code"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={() => setIsModalOpen(true)} className={btnStyle.filled}>
          + Add Subject
        </button>
      </div>)
}

function CardSubjects({ filteredSubjects, onEdit, setSubjects }) {
  function onDelete(id){
    ConfirmToast("Are you sure to remove subject?", async () => {
      try {
        const res = await deleteSubject(id); // call your API
        toast.success(res.message || "Subject deleted successfully");
        // Remove the deleted subject from state
        setSubjects((prev) => prev.filter((subj) => subj.subject_id !== id));
      } catch (err) {
        console.error("Failed to delete subject:", err);
        toast.error(err?.response?.data?.message || "Failed to delete subject");
      }
    })
  }

  return (
    <div className={gridStyle.item4atRowNoScroll}>
      {filteredSubjects.length > 0 ? (
        filteredSubjects.map((subj) => (
          <div key={subj.subject_id} className={cardStyle.cardContainer}>
            <div className={`${flexStyle.between} pb-2 mb-2 border-b-1 border-gray-200`}>
              <h1 className="text-xl font-bold text-gray-600">{subj.subject_name}</h1>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(subj)}
                >
                  <Pencil className={"h-5 text-sky-400"} />
                </button>
                <button
                  onClick={() => onDelete(subj.subject_id)}
                >
                  <Trash2 className="h-5 w-5 text-red-500" />
                </button>
              </div>
            </div>
            <p className={`text-sm w-full p-2 rounded-md`} style={{backgroundColor: subj.subject_color}}>Code: {subj.subject_code}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No subjects found</p>
      )}
    </div>
  );
}

function AddSubjectModal({ isModalOpen, closeModal, setSubjects, setIsModalOpen }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      const newSubject = await createSubject(data);
      // Add to state
      setSubjects((prev) => [...prev, { ...data, subject_id: newSubject.subject_id, subject_color: newSubject.subject_color }]);
      toast.success(newSubject.message || "Subject created successfully");
      reset();
      setIsModalOpen(false);
    } catch (err) {
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        console.error("Failed to create subject:", err);
        toast.error("Failed to create subject");
      }
    }
  };

  return (
    <Modal isOpen={isModalOpen} containerStyle="sm" onClose={closeModal} title="Add New Subject">
      <form onSubmit={handleSubmit(onSubmit)} className={gridStyle.item2atRow}>
        {/* Subject Name */}
        <div className="flex flex-col px-2">
          <label htmlFor="subject_name" className={labelStyle.primary}>
            Subject Name
          </label>
          <input
            id="subject_name"
            type="text"
            placeholder="Subject Name"
            className={inputStyle.primary}
            {...register("subject_name", { required: "Subject name is required" })}
          />
          {errors.subject_name && (
            <p className="text-red-500 text-sm mt-1">{errors.subject_name.message}</p>
          )}
        </div>

        {/* Subject Code */}
        <div className="flex flex-col px-2">
          <label htmlFor="subject_code" className={labelStyle.primary}>
            Subject Code
          </label>
          <input
            id="subject_code"
            type="text"
            placeholder="Subject Code"
            className={inputStyle.primary}
            {...register("subject_code", { required: "Subject code is required" })}
          />
          {errors.subject_code && (
            <p className="text-red-500 text-sm mt-1">{errors.subject_code.message}</p>
          )}
        </div>

        {/* Submit & Cancel */}
        <div className="col-span-full flex justify-end mt-4">
          <button type="submit" disabled={isSubmitting} className={btnStyle.filled}>
            {isSubmitting ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={closeModal}
            className={`${btnStyle.secondary} ml-2`}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

function EditSubjectModal({ isModalOpen, closeModal, subject, setSubjects }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  // Reset form whenever subject changes
  useEffect(() => {
    if (subject) {
      reset({
        subject_name: subject.subject_name,
        subject_code: subject.subject_code,
      });
    }
  }, [subject, reset]);

  const onSubmit = async (data) => {
    try {
      const updated = await updateSubject(subject.subject_id, data);

      setSubjects((prev) =>
        prev.map((s) =>
          s.subject_id === subject.subject_id ? { ...s, ...data } : s
        )
      );

      toast.success(updated.message || "Subject updated successfully");
      closeModal();
    } catch (err) {
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        console.error("Failed to update subject:", err);
        toast.error("Failed to update subject");
      }
    }
  };

  return (
    <Modal isOpen={isModalOpen} containerStyle="sm" onClose={closeModal} title="Edit Subject">
      <form onSubmit={handleSubmit(onSubmit)} className={gridStyle.item2atRow}>
        {/* Subject Name */}
        <div className="flex flex-col px-2">
          <label htmlFor="subject_name" className={labelStyle.primary}>
            Subject Name
          </label>
          <input
            id="subject_name"
            type="text"
            placeholder="Subject Name"
            className={inputStyle.primary}
            {...register("subject_name", { required: "Subject name is required" })}
          />
          {errors.subject_name && (
            <p className="text-red-500 text-sm mt-1">{errors.subject_name.message}</p>
          )}
        </div>

        {/* Subject Code */}
        <div className="flex flex-col px-2">
          <label htmlFor="subject_code" className={labelStyle.primary}>
            Subject Code
          </label>
          <input
            id="subject_code"
            type="text"
            placeholder="Subject Code"
            className={inputStyle.primary}
            {...register("subject_code", { required: "Subject code is required" })}
          />
          {errors.subject_code && (
            <p className="text-red-500 text-sm mt-1">{errors.subject_code.message}</p>
          )}
        </div>

        {/* Submit & Cancel */}
        <div className="col-span-full flex justify-end mt-4">
          <button type="submit" disabled={isSubmitting} className={btnStyle.filled}>
            {isSubmitting ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={closeModal}
            className={`${btnStyle.secondary} ml-2`}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}


export default Subjects;