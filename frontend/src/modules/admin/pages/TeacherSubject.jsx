import React, { useEffect, useMemo, useState } from 'react';
import { Pencil, Eye, Trash2, Search, PlusCircle } from 'lucide-react';
import { getClasses, getSubjects, getTeachers, addClassSubjectTeacher, getTeacherAssignment, deleteTimeTableRecord } from '../../../api/timetable';
import Modal from '../../../componenets/ModalContainer';
import { btnStyle, divStyle, dropdownStyle, gridStyle, inputStyle, labelStyle } from '../../../styles/componentsStyle';
import { tableStyles } from '../../../styles/componentsStyle';
import { toast } from 'react-toastify';
import FieldsResult from '../../../componenets/FieldsResult';
import { useForm } from 'react-hook-form';
import { ConfirmToast } from "../../../componenets/Toaster";
import Table from '../../../componenets/Table';


function TeacherSubject() {
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignments,setAssignments] = useState([])
  const [searchTerm,setSearchTerm] = useState("")  

  async function fetchData() {
    try {
      const [t, c, s] = await Promise.all([ getTeachers(), getClasses(), getSubjects()]);
      setTeachers(t);
      setClasses(c);
      setSubjects(s);
    } catch (err) {
      console.error(err);
    }
  }
  // Fetch data
  useEffect(() => { fetchData() }, []);

  const openAssignModal = (teacher) => {
    setSelectedTeacher(teacher);
    setAssignModalOpen(true);
  };
  const openViewModal = async (teacher) => {
    setSelectedTeacher(teacher);
    try {
      const data = await getTeacherAssignment(teacher.user_id);
      setAssignments(data);
      setViewModalOpen(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load teacher assignments");
    }
  };

  const filteredTeachers = useMemo(() => {
    const term = searchTerm.toLowerCase()
    return teachers.filter((t) =>
        (`${t.firstname} ${t.lastname} ${t.user_code} ${t.subject_name} ${t.email}`).toLowerCase().includes(term)
      )
  }, [teachers, searchTerm]);

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Teachers & Subjects</h2>
        <HeaderSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} /><br />
        {/* View Table */}
        <Table

          columns={[
                  { key: "user_code", label: "ID" },
                  { key: "firstname", label: "fullname", render: (val, row) => ( row.firstname + " " + row.lastname)},
                  { key: "phone", label: "Phone" },
                  { key: "email", label: "email" },
                  { key: "total_credits", label: "credits" },
                                
              ]}
          records={filteredTeachers}
          actions={(row) => [
            {
              label: <Pencil size={20} />, 
              className: tableStyles.primaryBtn,
              onClick: () => openViewModal(row)
            },
            {
              label: <PlusCircle size={20} />, 
              className: tableStyles.dangerBtn,
              onClick: () => openAssignModal(row)
            },
          ]}
      />     
      {/* View Teacher Subjects Credit */}
      <ShowTeachersSubjectCredit  viewModalOpen={viewModalOpen} selectedTeacher={selectedTeacher} assignments={assignments} setAssignments={setAssignments} setViewModalOpen={setViewModalOpen} />
      {/* Assign Modal */}
      <AssignSubjectCreditToTeacher  assignModalOpen={assignModalOpen} selectedTeacher={selectedTeacher} setAssignModalOpen={setAssignModalOpen} classes={classes} subjects={subjects} />
    </>
  );
}

export default TeacherSubject;

function HeaderSection({ searchTerm, setSearchTerm }){
    return(
      <div className={divStyle.betweenResponsiveReverse}>
        <div className="relative w-full">
          <Search className={inputStyle.searchIcon} />
          <input
            type="text"
            className={inputStyle.primary}
            placeholder="Search teacher by: Name, ID, Email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>)
}


function ShowTeachersSubjectCredit({ viewModalOpen, selectedTeacher, assignments, setAssignments, setViewModalOpen }){
    function removeRecord(id){
      ConfirmToast("Are you sure to remove record ?", async()=>{
        try{
          const res = await deleteTimeTableRecord(id);
          toast.success(res.message)
          setAssignments(prev => prev.filter( p => p.timetable_id != id))
        }catch(err){
          console.error(err)
        }
      })
    }
  return(
    viewModalOpen && selectedTeacher && (
        <Modal
              isOpen={viewModalOpen}
              containerStyle="md"
              onClose={() => setViewModalOpen(false)}
              title={`Subjects Assigned to ${selectedTeacher.firstname} ${selectedTeacher.lastname}`}
            >
              {assignments.length === 0 ? (
                <p className="text-gray-500">No subjects assigned yet.</p>
              ) : (
                <table className={tableStyles.table}>
                  <thead className={tableStyles.thead}>
                    <tr>
                      <th className={tableStyles.th}>Record ID</th>
                      <th className={tableStyles.th}>Class</th>
                      <th className={tableStyles.th}>Subject</th>
                      <th className={tableStyles.th}>Count</th>
                      <th className={tableStyles.th}>Academic Year</th>
                      <th className={tableStyles.th}>Remove</th>
                    </tr>
                  </thead>
                  <tbody className={tableStyles.tbody}>
                    {assignments.map((a, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className={tableStyles.td}>{i+1}</td>
                        <td className={tableStyles.td}>{a.class_code || a.class_name}</td>
                        <td className={tableStyles.td}>{a.subject_name}</td>
                        <td className={tableStyles.td}>{a.count}</td>
                        <td className={tableStyles.td}>{a.academic_year}</td>
                        <td className="px-4 py-2 flex justify-center">
                            <button onClick={() => removeRecord(a.timetable_id)} className={tableStyles.dangerBtn}>
                              <Trash2 size={20} />
                            </button>
                          </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
        </Modal>
      )
  )
}

function AssignSubjectCreditToTeacher({ assignModalOpen, selectedTeacher, setAssignModalOpen, classes, subjects}){
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
      const assignFields = [
          {
              name: "class_id",
              label: "Class",
              type: "select",
              options: classes.map(cls => ({ value: cls.class_id, label: cls.class_code })),
              validation: { required: "Class is required" },
          },
          {
              name: "subject_id",
              label: "Subject",
              type: "select",
              options: subjects.map(sub => ({ value: sub.subject_id, label: sub.subject_name })),
              validation: { required: "Subject is required" },
          },
          {
              name: "count",
              label: "Count",
              type: "number",
              validation: { required: "Count is required", min: { value: 1, message: "Minimum 1" } },
          },];
    const onSubmit = async (formData) => {
        try {
            // return console.log({...formData,teacher_id: selectedTeacher.user_id})
            await addClassSubjectTeacher({...formData, teacher_id: selectedTeacher.user_id});
            // await addClassSubjectTeacher(formData);
            toast.success("subject with credit add successfully");
            // reset()
        } catch (err) {
            toast.error(err); 
        }
    };

  return(
      assignModalOpen && selectedTeacher && (
        <Modal
            isOpen={assignModalOpen}
            containerStyle="sm"
            onClose={() => setAssignModalOpen(false)}
            title={`Assign Subject to ${selectedTeacher.firstname} ${selectedTeacher.lastname}`}
        >
            <form className={gridStyle.item3atRow} onSubmit={handleSubmit(onSubmit)}>
            <FieldsResult
                fields={assignFields}
                register={register}
                errors={errors}
                inputStyle={inputStyle}
                dropdownStyle={dropdownStyle}
                labelStyle={labelStyle}
            />
            <div className="col-span-full flex justify-end mt-4">
                <button type="submit" className={btnStyle.filled + " mr-2"} disabled={isSubmitting}>
                {isSubmitting ? "Assigning..." : "Assign"}
                </button>
                <button type="button" className={btnStyle.secondary} onClick={() => setAssignModalOpen(false)} disabled={isSubmitting}>
                Cancel
                </button>
            </div>
            </form>
        </Modal>)

  )
}