import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import Modal from "../../../componenets/ModalContainer";
import { btnStyle, cardStyle, gridStyle, inputStyle, labelStyle, flexStyle, dropdownStyle } from "../../../styles/componentsStyle";
import { getClassTeachers, assignClassTeacher, deleteClassTeacher } from "../../../api/adminAPI";
import { getClasses, getTeachers } from "../../../api/timetable";
import { ConfirmToast } from "../../../componenets/Toaster";


const TeacherClass = () => {
  const [classTeachers, setClassTeachers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Delete Class Supervisor
  const handleDelete = async (class_id) => {
    ConfirmToast("Are you sure you want to delete?",async() => {
        try {
            await deleteClassTeacher(class_id);
            setClassTeachers((prev) => prev.filter(c => c.class_id !== class_id));
            toast.success("Class teacher removed");
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Failed to remove assignment");
        }
    })
  };

  return (
    <>
      <div className={flexStyle.between}>
        <h1 className="text-2xl font-bold">Class Supervisors</h1>
        {/* Add Button */}
        <button onClick={() => setIsAddModalOpen(true)} className={`${btnStyle.filled} mb-4`}>
            + Assign Teacher
        </button>
      </div>

      {/* List assignments */}
      <div className={gridStyle.item4atRowNoScroll}>
        {classTeachers.length > 0 ? (
          classTeachers.map((ct) => (
            <div key={ct.class_id} className={cardStyle.cardContainer}>
              <div className={`${flexStyle.between} pb-2 mb-2 border-b-1 border-gray-200`}>
                <h1 className="text-xl font-bold text-gray-600">{ct.class_name}</h1>
                <button onClick={() => handleDelete(ct.class_id)}>
                  <Trash2 className="h-5 w-5 text-red-500" />
                </button>
              </div>
              <p className="text-sm p-2">
                Teacher: {ct.teacher_name || <span className="text-red-500">Not Assigned</span>}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No class teachers assigned</p>
        )}
      </div>

      {/* Add Modal */}
      <AddClassTeacher isAddModalOpen={isAddModalOpen} closeAddModal={() => setIsAddModalOpen(false)} setClassTeachers={setClassTeachers} />
    </>
  );
};

export default TeacherClass;


function AddClassTeacher({ isAddModalOpen, closeAddModal, setClassTeachers }){
    const [classes, setClasses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const { register, handleSubmit, reset } = useForm();

    const loadData = async () => {
        try {
            const year = new Date().getFullYear();
            const ctData = await getClassTeachers(year);
            setClassTeachers(ctData.data);
            const classesData = await getClasses();
            setClasses(classesData);
            const teachersData = await getTeachers();
            setTeachers(teachersData);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load data");
        }
    };
    useEffect(() => { loadData() }, []);

    // Add new assignment
    const onAddSubmit = async (data) => {
        try {
            const res = await assignClassTeacher(data.class_id, data.teacher_id);
            toast.success(res.message || "Teacher assigned successfully");
            setClassTeachers((prev) => [...prev, { ...data, teacher_name: res.data.teacher_name, class_name: res.data.class_code }]);
            closeAddModal();
            reset();

        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "This class has teacher");
        }
    };
    return(
        isAddModalOpen && (
          <Modal isOpen={isAddModalOpen} containerStyle="sm" onClose={closeAddModal} title="Assign Teacher to Class">
            <form onSubmit={handleSubmit(onAddSubmit)} className={gridStyle.item2atRow}>
                {/* Class dropdown */}
                <div className="flex flex-col px-2">
                <label className={labelStyle.primary}>Class</label>
                <select className={dropdownStyle.base} {...register("class_id", { required: "Class is required" })}>
                    <option value="" disabled>Select a class</option>
                    {classes.map((cls) => (
                      <option key={cls.class_id} value={cls.class_id}>{cls.class_code}</option>
                    ))}
                </select>
                </div>

                {/* Teacher dropdown */}
                <div className="flex flex-col px-2">
                <label className={labelStyle.primary}>Teacher</label>
                <select className={dropdownStyle.base} {...register("teacher_id", { required: "Teacher is required" })}>
                    <option value="" disabled>Select a teacher</option>
                    {teachers.map((t) => (
                      <option key={t.user_id} value={t.user_id}>{t.firstname} {t.lastname}</option>
                    ))}
                </select>
                </div>

                <div className="col-span-full flex justify-end mt-4">
                <button type="submit" className={btnStyle.filled}>Assign</button>
                <button type="button" className={`${btnStyle.secondary} ml-2`} onClick={closeAddModal}>Cancel</button>
                </div>
            </form>
          </Modal>
      )
    )
}