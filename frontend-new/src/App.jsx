import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized.jsx';
import SetupFirstAdmin from './pages/SetupFirstAdmin.jsx';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import GenerateQuiz from './pages/Student/GenerateQuiz';
import DashboardContent from './components/Admin/DashboardContent.jsx';
import StudentsPage from './components/Admin/StudentsPage.jsx';
import TeachersPage from './components/Admin/TeachersPage.jsx';
import ReceptionistsPage from './components/Admin/ReceptionistsPage.jsx';
import FinancePage from './components/Admin/FinancePage.jsx';
import AnnouncementPage from './components/Admin/AnnouncementPage.jsx';

// Reception Imports
import ReceptionLayout from './components/Layouts/ReceptionLayout.jsx';
import ReceptionDashboard from './components/Reception/ReceptionistDashboard.jsx';
import ReceptionStudentsPage from './components/Reception/ReceptionStudentsPage.jsx';
import ReceptionFeesPage from './components/Reception/ReceptionFeesPage.jsx';
import ReceptionAttendancePage from './components/Reception/ReceptionAttendancePage.jsx';

import ProtectedRoute from './ProtectedRoute.jsx';
import TeacherLayout from './components/Layouts/TeacherLayout.jsx';
import TeacherDashboard from './components/Teacher/TeacherDashboard.jsx';
import TeacherStudentsPage from './components/Teacher/TeacherStudentsPage.jsx';
import TeacherResultsPage from './components/Teacher/TeacherResultsPage.jsx';
import StudentLayout from './components/Layouts/StudentLayout.jsx';
import StudentDashboard from './components/Student/StudentDashboard.jsx';
import LandingPage from './pages/LandingPage.jsx';
import ChangePassword from './pages/ChangePassword.jsx';

const App = () => {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path='/login' element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/setup-first-admin" element={<SetupFirstAdmin />} />

        {/* Protected Admin Routes */}
        <Route
          path='/admin/*'
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          {/* Nested routes ka use tab kiya jaata hai jab aap kisi parent page (jaise ki Dashboard) ke andar sub-sections 
        (jaise Profile, Settings) banana chahte hain, jismein layout kaafi had tak same 
        rehta hai aur sirf content area change hota hai.  */}

          {/* Nested Routes inside Admin-Dashboard (Outlet se render hongay) */}
          <Route index element={<Navigate to="dashboard" replace />} /> {/* /admin => /admin/dashboard */}
          <Route path="dashboard" element={<DashboardContent />} />
          <Route path="az-students" element={<StudentsPage />} />
          <Route path="az-teachers" element={<TeachersPage />} />
          <Route path="az-receptionists" element={<ReceptionistsPage />} />
          <Route path="finance" element={<FinancePage />} />
          <Route path="announcements" element={<AnnouncementPage />} />

        </Route>

        {/* Protected Reception Routes */}
        <Route path='/reception/*'
          element={
            <ProtectedRoute requiredRole="receptionist">
              <ReceptionLayout />
            </ProtectedRoute>
          }>

          <Route index element={<Navigate to="dashboard" replace />} /> {/* /reception => /reception/dashboard */}
          <Route path="dashboard" element={<ReceptionDashboard />} />
          <Route path="az-students" element={<ReceptionStudentsPage />} />
          <Route path="fees" element={<ReceptionFeesPage />} />
          <Route path="attendance" element={<ReceptionAttendancePage />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>

        <Route
          path="/teacher/*"
          element={
            <ProtectedRoute requiredRole="teacher">
              <TeacherLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="students" element={<TeacherStudentsPage />} />
          <Route path="results" element={<TeacherResultsPage />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>

        <Route
          path="/student/*"
          element={
            <ProtectedRoute requiredRole="student">
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          {/* AI MCQs Route */}
          <Route path="ai-mcqs" element={<GenerateQuiz />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Koi unknown route hoga to login par bhej dey ga */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
};

export default App;