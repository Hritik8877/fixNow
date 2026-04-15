import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "@/layouts/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import LandingPage from "@/pages/Landing/LandingPage";
import LoginPage from "@/pages/Auth/LoginPage";
import SignupPage from "@/pages/Auth/SignupPage";
import ForgotPasswordPage from "@/pages/Auth/ForgotPasswordPage";
import VerifyOtpPage from "@/pages/Auth/VerifyOtpPage";
import ResetPasswordPage from "@/pages/Auth/ResetPasswordPage";
import UserDashboard from "@/pages/Dashboard/UserDashboard";
import ServicesPage from "@/pages/Service/ServicesPage";
import ServiceDetailPage from "@/pages/Service/ServiceDetailPage";
import BookingPage from "@/pages/Booking/BookingPage";
import TechnicianDashboard from "@/pages/Dashboard/TechnicianDashboard";
import AdminDashboard from "@/pages/Dashboard/AdminDashboard";
import ProfilePage from "@/pages/Profile/ProfilePage";

import { ThemeProvider } from "@/context/ThemeContext";

function AppLayout({ children, hideNav }) {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {!hideNav && <Navbar />}
      {children}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
        {/* Public */}
        <Route path="/" element={<AppLayout><LandingPage /></AppLayout>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/services" element={<ProtectedRoute restrictedRoles={['technician']}><AppLayout><ServicesPage /></AppLayout></ProtectedRoute>} />
        <Route path="/services/:id" element={<ProtectedRoute restrictedRoles={['technician']}><AppLayout><ServiceDetailPage /></AppLayout></ProtectedRoute>} />

        {/* User Protected */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['user']}>
            <AppLayout><UserDashboard /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/bookings" element={
          <ProtectedRoute allowedRoles={['user']}>
            <AppLayout><UserDashboard /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/booking/:serviceId" element={
          <ProtectedRoute allowedRoles={['user']}>
            <AppLayout><BookingPage /></AppLayout>
          </ProtectedRoute>
        } />

        {/* Technician Protected */}
        <Route path="/technician" element={
          <ProtectedRoute allowedRoles={['technician']}>
            <AppLayout><TechnicianDashboard /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/technician/services" element={
          <ProtectedRoute allowedRoles={['technician']}>
            <AppLayout><TechnicianDashboard /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/technician/orders" element={
          <ProtectedRoute allowedRoles={['technician']}>
            <AppLayout><TechnicianDashboard /></AppLayout>
          </ProtectedRoute>
        } />

        {/* Admin Protected */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AppLayout><AdminDashboard /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AppLayout><AdminDashboard /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/bookings" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AppLayout><AdminDashboard /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/stats" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AppLayout><AdminDashboard /></AppLayout>
          </ProtectedRoute>
        } />

        {/* Profile - Any authenticated user */}
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['user', 'technician', 'admin']}>
            <AppLayout><ProfilePage /></AppLayout>
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<AppLayout><LandingPage /></AppLayout>} />
      </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
