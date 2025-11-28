import { Route, Routes, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/Dashboard';
import AdminLayout from '../../layouts/AdminLayout';
import ProtectedRoute from '../../routes/ProtectedRoute';
import Profile from '../common/Profile';
import Students from './pages/Students';
import Classes from './pages/Classes';
import ClassStudents from './pages/ClassStudents';
import NotFoundPage from '../common/404';
import Subjects from './pages/Subjects';
import TeacherSubject from './pages/TeacherSubject';
import ShowTimetable from './pages/TimeTable';
import UserManual from '../common/UserManual';
import TeacherClass from './pages/TeacherClass';
import StudentsAttendance from './pages/StudentsAttendance';
import ClassesAttendance from './pages/ClassesAttendance';
import AiMode from './pages/AiMode';
import AttendanceReport from './pages/AttendanceReport';
import TeacherAttendanceReports from './pages/TeacherReports';
import StudentsAttendaceReport from './pages/StudentsAttendaceReport';
import StudentLeave from './pages/StudentLeave';
import TeacherTimetable from './pages/TeacherTimetable';
import StudentStatusReport from './pages/StudentStatusReport';
import Fees from './pages/Fees';
import StudentFeesUnpaid from './pages/StudentFeesUnpaid';
import { useAuth } from '../../hooks/useAuth';
// import { useContext } from 'react';
// import { AuthContext } from '../../context/AuthContext';

const AdminModule = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="classes" element={<Classes />} />
        <Route path="classes/:classId" element={<ClassStudents />} />
        <Route path="fees" element={<Fees />} />
        <Route path="subjects" element={<Subjects />} />
        <Route path="teacher-class-subject" element={<TeacherSubject />} />
        <Route path="timetable" element={<ShowTimetable />} />
        <Route path="teacher-timetable" element={<TeacherTimetable />} />
        <Route path="user-manual" element={<UserManual pdfUrl={"/manuals/admin-manual.pdf"} title="Admin User Manual" />} />
        <Route path="class-supervisor" element={<TeacherClass />} />
        <Route path="student-attendance" element={<ClassesAttendance />} />
        <Route path="student-attendance/:classId" element={<StudentsAttendance teacherId={user?.user_id} />} />
        <Route path="teacher-attendance" element={<TeacherAttendanceReports />} />
        <Route path="attendance-report" element={<AttendanceReport />} />
        <Route path="attendance-report/:classId" element={<StudentsAttendaceReport />} />
        <Route path="student-leave" element={<StudentLeave />} />
        <Route path="student-unpaid-fees" element={<StudentFeesUnpaid />} />
        <Route path="student-status-report" element={<StudentStatusReport />} />

        <Route path="profile" element={<Profile title="Admin Profile" />} />
        <Route path="ai-mode" element={<AiMode />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* <Route path="*" element={<Navigate to="dashboard" replace />} /> */}
    </Routes>
  );
};

export default AdminModule;
