const express = require('express');
const router = express.Router();
const { getDashboardAdminCounts, getTeacherCreditCounts, getStudentStatusCounts, getTeacherMonthlyAttendance, getTodayAbsentTeachers } = require('../controllers/adminDashboardController');
const { getAllStudents, getStudentById, deleteStudent, getAllStudentsAllStatus, addStudent, updateStudent3Parcha, updateStudent, getAllStudentsAdmin } = require('../controllers/studentController');
const { getAllClasses, addClass, getAllStudentInClass, getStudentsNotInClass, removeStudentFromClass, addStudentToClass, updateClassStatus, getClassById, updateClass } = require('../controllers/classController');
const { getAllSubjects, addSubject, getSubjectById, updateSubject, deleteSubject } = require('../controllers/subjectsController');
const { assignClassTeacher, getAllClassTeachersForYear, getClassTeacher, deleteClassTeacher } = require('../controllers/classTeacherController');
const { saveAttendance, getClassStudents, getTeachersAttendanceStatus, getClassStudentsReport, getStudentMonthlyAttendance } = require('../controllers/teacherClassAttendanceController');
const { getUnpaidFees } = require('../controllers/studentPaymentController');
const { adminGetStudentStatusReport, adminAttendanceReportClassByDate } = require('../controllers/reportsController');
const { getAllFees, createFee, getFeeById, updateFee, deleteFee } = require('../controllers/feesController');


// Middlewares
const authMiddleware = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');
const { sanitizeInput } = require('../middlewares/sanitizeHtml');
const validateRequest = require('../middlewares/validateRequest');
const { baseStudentSchema, classSchema } = require('../validators/schemas');
const { default: cleanupFileOnError } = require('../middlewares/cleanUpFileOnError');
const { uploadImage } = require('../middlewares/multer');
const { addSubjectSchema, updateSubjectSchema } = require('../validators/subjectSchemas');
const { assignClassTeacherSchema } = require('../validators/classTeacherSchema');
const { saveAttendanceSchema } = require('../validators/teacherClassAttendanceSchema');

// Auth & role middleware
router.use(authMiddleware);
router.use(roleCheck(['admin']))
router.use(sanitizeInput)

// dashboard 
router.get('/dashboard/counts', getDashboardAdminCounts);
router.get('/dashboard/credit', getTeacherCreditCounts)
router.get('/dashboard/student-status', getStudentStatusCounts)
router.get('/dashboard/teacher-month-attendance', getTeacherMonthlyAttendance)
router.get('/dashboard/teacher-absent-today', getTodayAbsentTeachers)

// Students
router.get('/students', getAllStudentsAdmin);
router.get('/students/:id', getStudentById);
router.get('/students/all/status', getAllStudentsAllStatus);
router.post('/students', cleanupFileOnError, uploadImage('students_profile'), sanitizeInput, validateRequest(baseStudentSchema), addStudent);
router.put("/students/c_parcha/:id", updateStudent3Parcha)
router.put('/students/:id', validateRequest(baseStudentSchema), sanitizeInput, updateStudent);
router.delete('/students/:id', deleteStudent);

// Fees
router.get('/fees', getAllFees)
router.get('/fees/:id', getFeeById)
router.post('/fees', createFee)
router.put("/fees/:id", updateFee)
router.delete("/fees/:id", deleteFee)

// Classes
router.get('/classes', getAllClasses);
router.get('/classes/:id', getClassById);
router.get('/classes/students/not-in-class', getStudentsNotInClass);
router.get('/classes/:id/students', getAllStudentInClass);
router.post('/classes', validateRequest(classSchema), addClass);
router.post('/classes/:id/students', addStudentToClass);
router.put('/classes/:id', updateClass);
router.put('/classes/:id/status', updateClassStatus);
router.delete('/classes/:id/students', removeStudentFromClass);

// Subjects
router.get('/subjects', getAllSubjects);
router.get('/subjects/:id', getSubjectById); // fixed naming
router.post('/subjects/', validateRequest(addSubjectSchema), addSubject);
router.put('/subjects/:id', validateRequest(updateSubjectSchema), updateSubject);
router.delete('/subjects/:id', deleteSubject);

// Teacher Class
router.post("/class-teachers/assign", validateRequest(assignClassTeacherSchema), assignClassTeacher);
router.get("/class-teachers/all/:academic_year", getAllClassTeachersForYear);
router.get("/class-teachers/:class_id/:academic_year", getClassTeacher);
router.delete("/class-teachers/:class_id", deleteClassTeacher);

// Student Attendance
router.get('/student-attendance/classes/:classId', getClassStudents)
router.get('/student-attendance/classes-reports/:classId', getClassStudentsReport)
router.get('/student-attendance/montly', getStudentMonthlyAttendance);
router.post('/student-attendance/save', validateRequest(saveAttendanceSchema), saveAttendance);

router.get('/teachers-attendance/report', getTeachersAttendanceStatus);

router.get('/reports/student-status', adminGetStudentStatusReport)
router.get('/reports/class-attendance/:class_id', adminAttendanceReportClassByDate)
router.get("/reports/student-fees/student-unpaid", getUnpaidFees)




module.exports = router;
