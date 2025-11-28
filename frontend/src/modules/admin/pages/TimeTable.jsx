import React, { useEffect, useRef, useState } from "react";
import { badge, tableStyles } from "../../../styles/componentsStyle";
import { btnStyle, flexStyle, inputStyle } from "../../../styles/componentsStyle";
import { toast } from "react-toastify";
import { classPrintTimetable, generateTimetable, getTimetable, saveTimetable } from "../../../api/timetable";
import { ConfirmToast } from "../../../componenets/Toaster";

function ShowTimetable() {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedFile, setSavedFile] = useState(null);
  const [viewMode, setViewMode] = useState({}); // store view mode per class
  const [search, setSearch] = useState(""); // search for class
  const printRefs = useRef({}); 

  // Fetch latest timetable
  const fetchTimetable = async () => {
    try {
      getTimetable({ setLoading: setLoading, seter: setTimetable, setSave: setSavedFile, setView: setViewMode})
    } catch (err) {
      console.error("Error fetching timetable:", err);
      toast.error("Error loading timetable. Please generate a new one.");
    } 
  };

  // Generate a new timetable (does not save automatically)
  const generateNewTimetable = async () => {
    try {
      await generateTimetable({ setLoading: setLoading, seter: setTimetable, setSave: setSavedFile, setView: setViewMode})
      toast.success("New timetable generated")
    } catch (err) {
      console.error("Error generating timetable:", err);
      toast.error("Overload subject please check Teacher Subject assigned")
    } 
  };

  // Save the currently displayed timetable
  const handleSaveTimetable = () => {
    ConfirmToast("Are you sure want to save timetable all teacher will see there new timetable !", async()=>{
      await saveTimetable({ toast: toast, setSave: setSavedFile, timetable: timetable})
    })
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  if (loading) return <p>Loading timetable...</p>;

  const filteredTimetable = timetable.filter(cls =>
    cls.class_name.toLowerCase().includes(search.toLowerCase())
  );

  const handlePrint = (classId, class_name, class_code) => {
    classPrintTimetable(classId, class_name, class_code, printRefs)
  };


  return (
    <>
      <div className={flexStyle.between + " my-4 flex-wrap"}>
        <div>
          <h1 className="text-xl font-semibold">Timetable Viewer</h1>
          <p className={savedFile ? badge.primarySm:badge.dangerSm}>
            {savedFile
              ? `Showing saved timetable`
              : "This is new generated timetable. Click 'Save' to store it."}
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button className={btnStyle.filled} onClick={generateNewTimetable}>
            Generate New Timetable
          </button>
          <button
            className={btnStyle.filled}
            onClick={handleSaveTimetable}
            disabled={timetable.length === 0}
          >
            Save
          </button>
        </div>
      </div>

      {/* Search Box */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search class by name..."
          className={`${inputStyle.primary} w-full`}
        />
      </div>

      {filteredTimetable.length === 0 && <p>No class found.</p>}

      {filteredTimetable.map((cls) => (
          <div key={cls.class_id} className="my-5">
            <div className="flex justify-between rounded-t-md flex-wrap items-center bg-sky-600">
              <h2 className="text-2xl font-bold py-2 pl-4 text-white rounded-t-2xl mb-0 min-w-20">
                {cls.class_name}
              </h2>

              <div className="flex gap-2 mr-2">
                <button
                  className={btnStyle.secondary + " text-sm"}
                  onClick={() =>
                    setViewMode(prev => ({ ...prev, [cls.class_id]: "students" }))
                  }
                >
                  All
                </button>
                <button
                  className={btnStyle.secondary + " text-sm"}
                  onClick={() =>
                    setViewMode(prev => ({ ...prev, [cls.class_id]: "teachers" }))
                  }
                >
                  Teachers
                </button>
                <button
                  className={btnStyle.success + " text-sm"}
                  onClick={() => handlePrint(cls.class_id, cls.class_name)}
                >
                  Print
                </button>
              </div>
            </div>

            {/* Table only has the ref for printing */}
            <div
              ref={el => (printRefs.current[cls.class_id] = el)}
              className={tableStyles.wrapper}
              style={{ borderRadius: 0 }}
            >
              <table className={tableStyles.table+" w-full"}>
                <thead className={tableStyles.thead}>
                  <tr>
                    <th className={tableStyles.th}>Day</th>
                    {Array.from({ length: 7 }).map((_, i) => (
                      <th key={i} className={tableStyles.th}>{`${i + 1} Hour`}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className={tableStyles.tbody}>
                  {cls.timetable.map(daySchedule => (
                    <tr key={daySchedule.day}>
                      <td className={tableStyles.td}>{daySchedule.day}</td>
                      {daySchedule.periods.map((p, idx) => (
                        <td
                          key={idx}
                          className={tableStyles.td + " border-b-2 border-slate-400 py-4"}
                          style={{ backgroundColor: p.subject_color || "#fff" }}
                        >
                          {p.subject_name ? (
                            viewMode[cls.class_id] === "students" ? (
                              <>
                                <div className="text-xl">{p.subject_name}</div>
                                <div className="text-xs text-gray-600 flex justify-end">
                                  {p.teacher_name}
                                </div>
                              </>
                            ) : (
                              <div className="text-center text-sm text-black">
                                {p.teacher_name}
                              </div>
                            )
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
        ))}
    </>
  );
}

export default ShowTimetable;
