import api from './axios';

///////////////////DASHBOARD///////////////////////
export const loadDashboardCounts = async ({ setCounts }) => {
    try {
        const res = await api.get("/admin/dashboard/counts");
        // console.log(res)
        setCounts(res.data);
    } catch (err) { 
        console.error(err);
    }
};

export const creditDashboardCounts = async ({ setCredit }) => {
    try {
      const res = await api.get("/admin/dashboard/credit");
      // console.log(res.data)
      setCredit(res.data);
    } catch (err) {
      console.error(err);
    }
};

export const studentStatusCounts = async ({ setStudentStatus }) => {
    try {
      const res = await api.get("/admin/dashboard/student-status");
    //   console.log(res.data)
      setStudentStatus(res.data);
    } catch (err) {
      console.error(err);
    }
};

export const teachersMonthAttendance = async ({ setTeachersAttendance }) => {
    try {
      const res = await api.get("/admin/dashboard/teacher-month-attendance");
    //   console.log(res.data)
      setTeachersAttendance(res.data);
    } catch (err) {
      console.error(err);
    }
};

export const teachersAbsentToday = async ({ setTeachersAbsent }) => {
    try {
      const res = await api.get("/admin/dashboard/teacher-absent-today");
    //   console.log(res.data)
      setTeachersAbsent(res.data);
    } catch (err) {
      console.error(err);
    }
};

///////////////////Students///////////////////////
export const fetchStudents = async () => {
  try {
    const response = await api.get('/admin/students'); // ✅ Correct endpoint
    // console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching students:', error.message);
    throw error; // rethrow so the caller can handle it
  }
};

export const fetchAllStudentsAllStatus = async () => {
  try {
    const response = await api.get('/admin/students/all/status'); // ✅ Correct endpoint
    // console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching students:', error.message);
    throw error; // rethrow so the caller can handle it
  }
};

export async function createStudent(data) {
  try {
    // if (!data.students_profile) throw "Please select a student profile";

    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => formData.append(k, v));
            // return console.log(data)
    const { data: res } = await api.post("/admin/students", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res;
  } catch (err) {
    console.error("createStudent error:", err?.response?.data?.message || err);
    throw err;
  }
}


export async function updateStudent(student_id, studentData) {
  if(!student_id) throw "student id is required for update"
  try {   
    const response = await api.put(`/admin/students/${student_id}`, studentData);
    return response.data;
  } catch (error) {
    if(error?.response?.status===400){
      console.error("Update record error:", error.response.data.message);
    }else console.error("update record error:", error);
    throw error;
  }
}

export async function deleteStudent(student_id) {
  try {
    const response = await api.delete(`/admin/students/${student_id}`);
    return response.data;  // return API response if needed
  } catch (error) {
    console.error("deleteStudent error:", error);
    throw error;
  }
}

export async function updateStudent3Parcha(student_id) {
  try {
    const response = await api.put(`/admin/students/c_parcha/${student_id}`);
    return response.data;  // return API response if needed
  } catch (error) {
    console.error("deleteStudent error:", error);
    throw error;
  }
}

///////////////////Fees///////////////////////
export async function fetchFees({ seter }) {
  try {
    const response = await api.get("/admin/fees");
    return seter(response.data);
  } catch (error) {
    console.error("fetchFees error:", error.response?.data || error.message);
    throw error;
  }
}

export async function createFee(data) {
  try {
    const response = await api.post("/admin/fees", data);
    return response.data;
  } catch (error) {
    console.error("createFee error:", error.response?.data || error.message);
    throw error;
  }
}

export async function updateFee(id, data) {
  try {
    const response = await api.put(`/admin/fees/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("updateFee error:", error.response?.data || error.message);
    throw error;
  }
}

export async function deleteFee(id) {
  try {
    const response = await api.delete(`/admin/fees/${id}`);
    return response.data;
  } catch (error) {
    console.error("deleteFee error:", error.response?.data || error.message);
    throw error;
  }
}

export async function fetchFeeById(id) {
  try {
    const response = await api.get(`/admin/fees/${id}`);
    return response.data;
  } catch (error) {
    console.error("fetchFeeById error:", error.response?.data || error.message);
    throw error;
  }
}

///////////////////Classes///////////////////////
export async function fetchClasses({ seter }) {
  try {
    const response = await api.get("/admin/classes"); // adapt URL to your backend
    return seter(response.data); // Axios response.data contains the payload
  } catch (error) {
    console.error("fetchClasses error:", error.message);
    throw error;
  }
}

export async function createClass(data) {
  try {
    const response = await api.post("/admin/classes", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; // return new class created by backend
  } catch (error) {
    console.error("createClass error:", error.response?.data || error.message);
    throw error;
  }
}

export async function updateClass(classId, data) {
  try {
    const response = await api.put(`/admin/classes/${classId}`, data);
    return response.data; // return updated class or success message
  } catch (error) {
    console.error("updateClass error:", error.response?.data || error.message);
    throw error;
  }
}

export async function loadStudentsClass({ classId, year, seter, seter2 }){
    try {
      const res = await api.get(`/admin/classes/${classId}/students?academic_year=${year}`);
      // console.log(res)
      const res2 = await api.get(`/admin/classes/${classId}`);
      seter(res.data);
      seter2(res2.data);
    } catch (err) {
      console.error(err);
      throw err
    }
};

export async function loadStudentsNotInClass({ isCurrentYear, year, seter }){
    if (!isCurrentYear) return;
    try {
      const res = await api.get(`/admin/classes/students/not-in-class`, { params: { year: year } });
      seter(res.data);
    } catch (err) {
      console.error(err);
      throw err
    }
  };

export async function addStudentToClass({ studentId, classId }){
    try {
        const res = await api.post(`/admin/classes/${classId}/students`, { student_id: studentId });
        return res
    } catch (err) {
        console.error(err);
        throw err
    }
};

export async function removeStudentFromClass({ studentId, classId }){
    try {
      const res = await api.delete(`/admin/classes/${classId}/students`, { data: { student_id: studentId } });
        return res
    } catch (err) {
      console.error(err);
      throw err
    }
};

export async function changeStatusClass( classId, status){
    try {
      await api.put(`/admin/classes/${classId}/status`, { status });
    } catch (err) {
      console.error(err);
      throw err
    }
};

export async function getClassStudents(classId) {
  try {
    const res = await api.get(`/admin/student-attendance/classes/${classId}`);
    // console.log(res)
    return res.data;
  } catch (error) {
    // console.log(error.response.data)
    if (error.code === "ERR_NETWORK") {
      throw `Error loading class students: ${error.message}`;
    }
    throw `Error loading class students: ${error?.response?.data?.message}`;
  }
}

///////////////////Subjects///////////////////////
export async function getSubjects() {
    try {
      const res = await api.get("/admin/subjects");
      return res.data
    } catch (error) {
        if(error.code==="ERR_NETWORK"){
            throw `Error loading subjects: ${error.message}`
        }
        throw `Error loading subjects: ${error.message}`
    }
};

export async function getUserById(userId) {
  try {
    const res = await api.get(`/admin/subjects/${userId}`); // make sure backend uses GET
    return res.data; // returns the user object
  } catch (error) {
    if (error.response) {
      // Server responded with a status other than 2xx
      throw `Error fetching subjects: ${error.response.data.message || error.response.statusText}`;
    } else if (error.request) {
      // Request was made but no response received
      throw `No response from server: ${error.message}`;
    } else {
      // Something else happened
      throw `Error fetching subjects: ${error.message}`;
    }
  }
}

export async function createSubject(data) {
  try {
    const response = await api.post("/admin/subjects", data);
    return response.data; // return data from backend
  } catch (err) {
    // console.log(err)
    if (err?.response?.status === 400) {
      throw new Error(err.response.data.message || "Bad Request");
    } else {
      throw new Error(`Failed to create subject: ${err.response.data.message || err}`);
    }
  }
}

export async function deleteSubject(user_id) {
  try {
    // return console.log(user_id)
    const res = await api.delete(`/admin/subjects/${user_id}`);
    return res.data;
  } catch (error) {
    throw `Error deleting subject: ${error.message}`;
  }
}

export async function updateSubject(user_id, data) {
  try {
    const response = await api.put(`/admin/subjects/${user_id}`, data);
    return response.data;
  } catch (err) {
    if (err?.response?.data?.message) {
      throw new Error(err.response.data.message);
    } else {
      throw new Error(`Failed to update subject: ${err.message}`);
    }
  }
}

///////////////////Teacher Class///////////////////////
export async function getClassTeachers(date) {
    try {
        const res = await api.get(`/admin/class-teachers/all/${date}`);
        return res.data;
    } catch (error) {
        if (error.code === "ERR_NETWORK") {
            throw `Error loading class teachers: ${error.message}`;
        }
        throw `Error loading class teachers: ${error.message}`;
    }
}

export async function assignClassTeacher(class_id, teacher_id) {
    try {
        const res = await api.post(`/admin/class-teachers/assign`, { class_id, teacher_id });
        // console.log(res)
        return res.data;
    } catch (error) {
        if (error.code === "ERR_NETWORK") {
            throw `Error assigning class teacher: ${error.message}`;
        }
        throw `Error assigning class teacher: ${error.message}`;
    }
}

export async function getClassTeacher(class_id) {
    try {
        const res = await api.get(`/admin/class-teachers/${class_id}`);
        return res.data;
    } catch (error) {
        if (error.code === "ERR_NETWORK") {
            throw `Error loading class teacher: ${error.message}`;
        }
        throw `Error loading class teacher: ${error.message}`;
    }
}

export async function deleteClassTeacher(class_id) {
    if (!class_id) throw "Class ID is required";

    try {
        const res = await api.delete(`/admin/class-teachers/${class_id}`);
        return res.data;
    } catch (error) {
        if (error.code === "ERR_NETWORK") {
            throw `Network error: ${error.message}`;
        }
        throw error.response?.data?.message || `Failed to delete class-teacher assignment: ${error.message}`;
    }
}


///////////////////Attendance///////////////////////
export async function saveClassAttendance(attendanceData) {
  try {
    const res = await api.post('/admin/student-attendance/save', attendanceData);
    return res.data;
  } catch (error) {
    if (error.code === "ERR_NETWORK") {
      throw `Error saving attendance: ${error.message}`;
    }
    throw `Error saving attendance: ${error.message}`;
  }
}

export const getTeacherAttendanceByDate = async (date) => {
  try {
    // return console.log(user_id, month, year)
    const response = await api.get(`/admin/teachers-attendance/report`, 
      { params: { date: date } }
    );
    // console.log(response)
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching attendance:", error.response?.data || error.message);
    throw error;
  }
};

export async function getClassStudentsReports(classId, year) {
  try {
    const res = await api.get(`/admin/student-attendance/classes-reports/${classId}?academicYearId=${year}`);
    // console.log(res)
    return res.data;
  } catch (error) {
    // console.log(error.response.data)
    if (error.code === "ERR_NETWORK") {
      throw `Error loading class students: ${error.message}`;
    }
    throw `Error loading class students: ${error?.response?.data?.message}`;
  }
}
// Get attendance by date
export const getAttendanceByDate = async (user_id, month, year) => {
  try {
    // return console.log(user_id, month, year)
    const response = await api.get(`/admin/student-attendance/montly`, 
      { params: { student_id: user_id, month: month, year: year } }
    );
    // console.log(response)
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching attendance:", error.response?.data || error.message);
    throw error;
  }
};

//////////////// Reports //////////////////

export const fetchStudentsStatusReport = async (sd,ed) => {
  try {
    const stats = new Set()
    const response = await api.get('/admin/reports/student-status', { 
      params: { 
        startDate: sd,
        endDate: ed
       }
    }); // ✅ Correct endpoint
    response.data.map( item => stats.add(item.status))
    // console.log(response.data)
    return { d:response.data, s: stats };
  } catch (error) {
    console.error('Error fetching students:', error.message);
    throw error; // rethrow so the caller can handle it
  }
};


export async function getClassAttendanceReportByDate(classId, sd, ed) {
  try {
    const res = await api.get(`/admin/reports/class-attendance/${classId}`, {
      params: {
        startDate: sd,
        endDate: ed
      }
    });
    return res.data;
  } catch (error) {
    // console.log(error.response.data)
    if (error.code === "ERR_NETWORK") {
      throw `Error loading class students: ${error.message}`;
    }
    throw `Error loading class students: ${error?.response?.data?.message}`;
  }
}


// Show students does not paid fees
export const getUnpaidStudents = async ({ seter, date }) => {
  try {
    const response = await api.get('/admin/reports/student-fees/student-unpaid',  {
        params: { date: date }
      }); // ✅ Correct endpoint
    return seter(response.data);
  } catch (error) {
    console.error('Error fetching students:', error.message);
    throw error; // rethrow so the caller can handle it
  }
};
// // Get attendance by date
// export const getAttendanceByDate = async (user_id, month, year) => {
//   try {
//     // return console.log(user_id, month, year)
//     const response = await api.get(`/admin/student-attendance/montly`, 
//       { params: { student_id: user_id, month: month, year: year } }
//     );
//     // console.log(response)
//     return response.data;
//   } catch (error) {
//     console.error("❌ Error fetching attendance:", error.response?.data || error.message);
//     throw error;
//   }
// };
