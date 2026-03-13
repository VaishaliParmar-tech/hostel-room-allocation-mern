import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import ApplyRoom from './pages/student/ApplyRoom';
import MyRequests from './pages/student/MyRequests';
import MyAllocation from './pages/student/MyAllocation';

// Warden pages
import WardenDashboard from './pages/warden/WardenDashboard';
import ManageRequests from './pages/warden/ManageRequests';
import AllocateRoom from './pages/warden/AllocateRoom';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageStudents from './pages/admin/ManageStudents';
import ManageWardens from './pages/admin/ManageWardens';
import ManageRooms from './pages/admin/ManageRooms';
import OccupancyReport from './pages/admin/OccupancyReport';

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <>
      {user && <Navbar />}
      <Routes>
        {/* Public routes */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to={user ? `/${user.role}/dashboard` : '/login'} />} />
        <Route path="/unauthorized" element={
          <div className="text-center mt-5">
            <h2>403 - Access Denied</h2>
            <p>You don't have permission to view this page.</p>
          </div>
        } />

        {/* Student routes */}
        <Route path="/student/dashboard" element={<PrivateRoute allowedRoles={['student']}><StudentDashboard /></PrivateRoute>} />
        <Route path="/student/apply"     element={<PrivateRoute allowedRoles={['student']}><ApplyRoom /></PrivateRoute>} />
        <Route path="/student/requests"  element={<PrivateRoute allowedRoles={['student']}><MyRequests /></PrivateRoute>} />
        <Route path="/student/allocation"element={<PrivateRoute allowedRoles={['student']}><MyAllocation /></PrivateRoute>} />

        {/* Warden routes */}
        <Route path="/warden/dashboard"  element={<PrivateRoute allowedRoles={['warden']}><WardenDashboard /></PrivateRoute>} />
        <Route path="/warden/requests"   element={<PrivateRoute allowedRoles={['warden']}><ManageRequests /></PrivateRoute>} />
        <Route path="/warden/allocate"   element={<PrivateRoute allowedRoles={['warden']}><AllocateRoom /></PrivateRoute>} />
        <Route path="/warden/rooms"      element={<PrivateRoute allowedRoles={['warden']}><ManageRooms /></PrivateRoute>} />

        {/* Admin routes */}
        <Route path="/admin/dashboard"   element={<PrivateRoute allowedRoles={['admin']}><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/students"    element={<PrivateRoute allowedRoles={['admin']}><ManageStudents /></PrivateRoute>} />
        <Route path="/admin/wardens"     element={<PrivateRoute allowedRoles={['admin']}><ManageWardens /></PrivateRoute>} />
        <Route path="/admin/rooms"       element={<PrivateRoute allowedRoles={['admin']}><ManageRooms /></PrivateRoute>} />
        <Route path="/admin/report"      element={<PrivateRoute allowedRoles={['admin']}><OccupancyReport /></PrivateRoute>} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
