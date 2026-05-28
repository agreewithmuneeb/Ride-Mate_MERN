import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import RoleBasedRoute from "../components/RoleBasedRoute";
import AdminLayout from "../layouts/AdminLayout";
import DriverLayout from "../layouts/DriverLayout";
import PassengerLayout from "../layouts/PassengerLayout";
import PublicLayout from "../layouts/PublicLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageBookings from "../pages/admin/ManageBookings";
import ManageDrivers from "../pages/admin/ManageDrivers";
import ManageRides from "../pages/admin/ManageRides";
import ManageUsers from "../pages/admin/ManageUsers";
import Reports from "../pages/admin/Reports";
import BookingRequests from "../pages/driver/BookingRequests";
import CreateRide from "../pages/driver/CreateRide";
import DriverDashboard from "../pages/driver/DriverDashboard";
import EditRide from "../pages/driver/EditRide";
import MyRides from "../pages/driver/MyRides";
import Verification from "../pages/driver/Verification";
import About from "../pages/public/About";
import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import NotFound from "../pages/public/NotFound";
import Register from "../pages/public/Register";
import Services from "../pages/public/Services";
import Unauthorized from "../pages/public/Unauthorized";
import AvailableRides from "../pages/passenger/AvailableRides";
import MyBookings from "../pages/passenger/MyBookings";
import PassengerDashboard from "../pages/passenger/PassengerDashboard";
import Profile from "../pages/passenger/Profile";
import RideDetails from "../pages/passenger/RideDetails";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="unauthorized" element={<Unauthorized />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleBasedRoute allowedRoles={["passenger"]} />}>
          <Route path="passenger" element={<PassengerLayout />}>
            <Route index element={<Navigate to="/passenger/dashboard" replace />} />
            <Route path="dashboard" element={<PassengerDashboard />} />
            <Route path="rides" element={<AvailableRides />} />
            <Route path="rides/:id" element={<RideDetails />} />
            <Route path="bookings" element={<MyBookings />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        <Route element={<RoleBasedRoute allowedRoles={["driver"]} />}>
          <Route path="driver" element={<DriverLayout />}>
            <Route index element={<Navigate to="/driver/dashboard" replace />} />
            <Route path="dashboard" element={<DriverDashboard />} />
            <Route path="create-ride" element={<CreateRide />} />
            <Route path="my-rides" element={<MyRides />} />
            <Route path="rides/:id/edit" element={<EditRide />} />
            <Route path="booking-requests" element={<BookingRequests />} />
            <Route path="verification" element={<Verification />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        <Route element={<RoleBasedRoute allowedRoles={["admin"]} />}>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="drivers" element={<ManageDrivers />} />
            <Route path="rides" element={<ManageRides />} />
            <Route path="bookings" element={<ManageBookings />} />
            <Route path="reports" element={<Reports />} />
          </Route>
        </Route>
      </Route>

      <Route element={<PublicLayout />}>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
