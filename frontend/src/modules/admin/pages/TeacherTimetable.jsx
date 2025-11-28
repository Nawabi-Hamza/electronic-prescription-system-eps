import React, { useEffect, useRef, useState } from "react";
import { dropdownStyle, tableStyles } from "../../../styles/componentsStyle";
import { btnStyle } from "../../../styles/componentsStyle";
import { toast } from "react-toastify";
import { getTeacherTimetableByName, getTimetableOfTeacher, handlePrintTimetable } from "../../../api/timetable";

function TeacherTimetable() {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teacherList, setTeacherList] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [showTeacherSchedule, setShowTeacherSchedule] = useState(false);

  const printRefs = useRef({});

  const fetchTimetable = async () => {
    await getTimetableOfTeacher({ toast: toast, setLoading: setLoading, seter: setTimetable, setTeacherList: setTeacherList })
  };

  useEffect(() => { fetchTimetable() }, []);

  if (loading) return <p>Loading timetable...</p>;

  const teacherTimetable = showTeacherSchedule && selectedTeacher ? getTeacherTimetableByName({ selectedTeacher: selectedTeacher, timetable: timetable, periodsCount: 7}) : [];
  // Print function (same style as class timetable)
  const handlePrint = (teacherName) => {
    handlePrintTimetable(teacherName, printRefs)
  };

  return (
    <>

      <h1 className="text-xl font-semibold my-4">Teacher Timetable Viewer</h1>

      {/* Teacher select */}
      <div className="flex gap-2 mb-4 flex-wrap md:flex-nowrap">
        <select
          value={selectedTeacher}
          onChange={e => setSelectedTeacher(e.target.value)}
          className={`${dropdownStyle.base} w-60`}
        >
          <option value="">🧑🏻‍🏫 Select Teacher</option>
          {teacherList.map((t, idx) => (
            <option key={idx} value={t}>{t}</option>
          ))}
        </select>
        <button
          className={btnStyle.filled}
          onClick={() => setShowTeacherSchedule(!!selectedTeacher)}
          disabled={!selectedTeacher}
        >
          Show Teacher Timetable
        </button>
        {showTeacherSchedule && selectedTeacher && (
          <button
            className={btnStyle.outlined+" flex text-nowrap"}
            onClick={() => handlePrint(selectedTeacher)}
          >
            🖨️ Print
          </button>
        )}
      </div>

      {/* Teacher timetable */}
      {showTeacherSchedule && teacherTimetable.length > 0 && (
        <div className="mt-5" ref={el => (printRefs.current[selectedTeacher] = el)}>
          <h2 className="text-lg font-semibold mb-2">Teacher: {selectedTeacher}</h2>
          <div className={tableStyles.wrapper}>
            <table className={tableStyles.table}>
              <thead className={tableStyles.thead}>
                <tr>
                  <th className={tableStyles.th}>Day</th>
                  {Array.from({ length: 7 }).map((_, i) => (
                    <th key={i} className={tableStyles.th}>{`Hour ${i + 1}`}</th>
                  ))}
                </tr>
              </thead>
              <tbody className={tableStyles.tbody}>
                {teacherTimetable.map(day => (
                  <tr key={day.day}>
                    <td className={tableStyles.td}>{day.day}</td>
                    {day.periods.map((p, idx) => (
                      <td
                        key={idx}
                        className={tableStyles.td + " border-b-2 border-slate-400 py-4 text-center"}
                        style={{ backgroundColor: p.color }}
                      >
                        {p.subject_name ? (
                          <>
                            <div className="text-sm font-semibold">{p.subject_name}</div>
                            <div className="text-xs">{p.class_name}</div>
                          </>
                        ) : (
                          <span className="text-gray-400">Free</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

export default TeacherTimetable;
