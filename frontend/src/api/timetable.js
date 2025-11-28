import api from './axios'; // your configured axios instance

// Subjects
export async function getSubjects() {
  try {
    const res = await api.get("/timetable/subjects");
    return res.data;
  } catch (error) {
    if (error.code === "ERR_NETWORK") {
      throw `Error loading subjects: ${error.message}`;
    }
    throw `Error loading subjects: ${error.message}`;
  } 
}

// Teachers
export async function getTeachers() {
  try {
    const res = await api.get("/timetable/teachers");
    return res.data;
  } catch (error) {
    if (error.code === "ERR_NETWORK") {
      throw `Error loading teachers: ${error.message}`;
    }
    throw `Error loading teachers: ${error.message}`;
  }
}

// Classes
export async function getClasses() {
  try {
    const res = await api.get("/timetable/classes");
    return res.data;
  } catch (error) {
    if (error.code === "ERR_NETWORK") {
      throw `Error loading classes: ${error.message}`;
    }
    throw `Error loading classes: ${error.message}`;
  }
}

// api/timetable.js
export async function getTeacherAssignment(teacherId) {
  try {
    const res = await api.get(`/timetable/teacher-assignment/${teacherId}`);
    return res.data;
  } catch (error) {
    if (error?.code === "ERR_NETWORK") {
      throw `Network error while loading teacher assignments: ${error.message}`;
    }
    if (error?.response?.data?.message) {
      throw error.response.data.message;
    }
    throw `Error loading teacher assignments: ${error.message}`;
  }
}

export async function deleteTimeTableRecord(record_id) {
  try {
    const res = await api.delete(`/timetable/record/${record_id}`);
    // console.log(res)
    return res.data;
  } catch (error) {
    if (error?.code === "ERR_NETWORK") {
      throw `Network error while loading teacher assignments: ${error.message}`;
    }
    if (error?.response?.data?.message) {
      throw error.response.data.message;
    }
    throw `Error loading teacher assignments: ${error.message}`;
  }
}

export async function addClassSubjectTeacher(data) {
  if (!data) throw new Error("No data provided");
  try {
    const payload = {
      class_id: parseInt(data.class_id, 10),
      subject_id: parseInt(data.subject_id, 10),
      teacher_id: parseInt(data.teacher_id, 10),
      count: parseInt(data.count, 10),
    };
    const res = await api.post("/timetable/teacher-class-subject", payload);
    // return console.log(res)
    return res.data;
  } catch (error) {
    // console.log(error)
    if (error?.response?.data?.message) {
      throw error.response.data.message;
    }
    throw error.message || "Error creating timetable mapping";
  }
}

export const fetchTimetableATeacher = async ({ setTimetable }) => {
    try {
      const res = await api.get("/timetable/save-timetable");
      const data = res.data.timetable || [];
      return setTimetable(data);
    } catch (err) {
      console.error(err);
      // toast.error("Failed to load timetable");
      throw err;
    }
};

// Create a teacher timetable
export const getTeacherTimetable = ({ teacherId, timetable, periodsCount }) => {
  const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
  // const periodsCount = 7;

  // Initialize empty timetable
  const teacherTT = days.map(day => ({
    day,
    periods: Array.from({ length: periodsCount }, () => ({ class_name: "", subject_name: "", color: "#fff" }))
  }));

  // Fill teacher timetable
  timetable.forEach(cls => {
    cls.timetable.forEach(daySchedule => {
      const dayIndex = days.indexOf(daySchedule.day);
      daySchedule.periods.forEach((p, idx) => {
        if (p.teacher_id === teacherId) {
          teacherTT[dayIndex].periods[idx] = {
            class_name: cls.class_name,
            subject_name: p.subject_name,
            color: p.subject_color || "#B3E5FC"
          };
        }
      });
    });
  });

  return teacherTT;
};

export function getTeacherTimetableByName({ selectedTeacher, timetable, periodsCount}){
    const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
    // const periodsCount = 7;

    // Initialize empty timetable
    const teacherTT = days.map(day => ({
      day,
      periods: Array.from({ length: periodsCount }, () => ({ class_name: "", subject_name: "", color: "#fff" }))
    }));

    // Fill teacher timetable
    timetable.forEach(cls => {
      cls.timetable.forEach(daySchedule => {
        const dayIndex = days.indexOf(daySchedule.day);
        daySchedule.periods.forEach((p, idx) => {
          if (p.teacher_name === selectedTeacher) {
            teacherTT[dayIndex].periods[idx] = {
              class_name: cls.class_name,
              subject_name: p.subject_name,
              color: p.subject_color || "#B3E5FC"
            };
          }
        });
      });
    });

    return teacherTT;
};

export const handlePrintTimetable = (teacherName, printRefs, width=800, height=600) => {
  const printContent = printRefs.current[teacherName];
  if (printContent) {
    const printWindow = window.open("", "", `width=${width},height=${height}`);

    const styles = Array.from(document.querySelectorAll("style, link[rel='stylesheet']"))
      .map(node => node.outerHTML)
      .join("\n");

    printWindow.document.write(`
      <html>
        <head>
          <title>${teacherName} Timetable</title>
          ${styles}
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              padding: 0;
              display: flex;
              justify-content: center;
              background: #fff;
            }
            .print-container {
              width: 100%;
              max-width: 1000px;
            }
            .print-header {
              margin-bottom: 20px;
            }
            .print-header h1 {
              font-size: 26px;
              font-weight: bold;
              margin: 0;
              padding: 10px;
              width: 100%;
              border: 2px solid #000;
              display: inline-block;
              border-radius: 8px;
              text-align: center;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #444;
              padding: 8px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${printContent.outerHTML}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }
};

export const classPrintTimetable = (classId, class_name, class_code, printRefs, width=800, height=600) =>{
  const printContent = printRefs.current[classId];
    if (printContent) {
      // const newWindow = window.open("", "");
      const printWindow = window.open("", "", `width=${width},height=${height}`);

  
      // Get all styles from the page (Tailwind + custom)
      const styles = Array.from(document.querySelectorAll("style, link[rel='stylesheet']"))
        .map(node => node.outerHTML)
        .join("\n");
  
      printWindow.document.write(`
        <html>
          <head>
            <title>${class_name} Timetable</title>
            ${styles}
            <style>
              body {
                   font-family: Arial, sans-serif;
                  margin: 20px;
                  padding: 0;
                  display: flex;
                  justify-content: center;
                  background: #fff;
              }
              .print-container {
                width: 100%;
                max-width: 1000px;
              }
              .print-header {
                margin-bottom: 20px;
              }
              .print-header h1 {
                font-size: 26px;
                font-weight: bold;
                margin: 0;
                padding: 10px;
                width: 100%;
                border: 2px solid #000;
                display: inline-block;
                border-radius: 8px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid #444;
                padding: 8px;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="print-container">
              <div class="print-header">
                <h1>${class_name}${class_code ? ` (${class_code})` : ""}</h1>
              </div>
              ${printContent.outerHTML}
            </div>
          </body>
        </html>
      `);
  
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
}

export async function getTimetable({ setLoading, seter, setSave, setView}){
  try {
    setLoading(true);
    const res = await api.get("/timetable/save-timetable");
    const data = res.data.timetable || [];
    seter(data);
    setSave(res.data.fileName || null);

    // initialize viewMode for each class
    const initialView = {};
    data.forEach(cls => {
      initialView[cls.class_id] = "students";
    });
    setView(initialView);
  } catch (err) {
    console.error("Error fetching timetable:", err);
    throw err
  } finally {
    setLoading(false);
  }
};

export async function getTimetableOfTeacher({ toast, setLoading, seter, setTeacherList}){
    try {
      setLoading(true);
      const res = await api.get("/timetable/save-timetable");
      const data = res.data.timetable || [];
      seter(data);

      // extract unique teachers
      const teachersSet = new Set();
      data.forEach(cls => {
        cls.timetable.forEach(day => {
          day.periods.forEach(p => {
            if (p.teacher_name) teachersSet.add(p.teacher_name);
          });
        });
      });
      setTeacherList([...teachersSet]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load timetable");
    } finally {
      setLoading(false);
    }
  };

export async function generateTimetable({ setLoading, seter, setSave, setView }){
  try {
    setLoading(true);
    const res = await api.get("/timetable/generate");
    const data = res.data || [];
    seter(data);
    setSave(null);

    // reset viewMode
    const initialView = {};
    data.forEach(cls => {
      initialView[cls.class_id] = "students";
    });
    setView(initialView);
  } catch (err) {
    console.error("Error generating timetable:", err);
    throw err
  } finally {
    setLoading(false);
  }
};

export async function saveTimetable({ toast, setSave, timetable }){
    try {
      const res = await api.post("/timetable/save-timetable", { timetable });
      setSave(res.data.fileName);
      toast.success(`(${res.data.fileName}) ${res.data.message}`);
    } catch (err) {
      console.error("Error saving timetable:", err);
      toast.error("Error saving timetable");
    }
};