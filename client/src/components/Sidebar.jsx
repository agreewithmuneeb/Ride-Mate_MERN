import { Car, ClipboardCheck, LayoutDashboard, ListChecks, MapPin, ShieldCheck, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = {
  passenger: [
    ["Dashboard", "/passenger/dashboard", LayoutDashboard],
    ["Available Rides", "/passenger/rides", MapPin],
    ["My Bookings", "/passenger/bookings", ListChecks],
    ["Profile", "/passenger/profile", UserRound],
  ],
  driver: [
    ["Dashboard", "/driver/dashboard", LayoutDashboard],
    ["Create Ride", "/driver/create-ride", Car],
    ["My Rides", "/driver/my-rides", MapPin],
    ["Requests", "/driver/booking-requests", ListChecks],
    ["Verification", "/driver/verification", ClipboardCheck],
    ["Profile", "/driver/profile", UserRound],
  ],
  admin: [
    ["Dashboard", "/admin/dashboard", LayoutDashboard],
    ["Users", "/admin/users", UserRound],
    ["Drivers", "/admin/drivers", ShieldCheck],
    ["Rides", "/admin/rides", Car],
    ["Bookings", "/admin/bookings", ListChecks],
    ["Reports", "/admin/reports", ClipboardCheck],
  ],
};

export default function Sidebar({ role }) {
  const { user, logout } = useAuth();
  const roleLinks = links[role] || [];

  return (
    <aside className="sidebar d-flex flex-column p-4 text-white">
      <div>
        <div className="d-flex align-items-center gap-3 mb-4">
          <div className="brand-mark d-inline-flex align-items-center justify-content-center rounded-3"><Car size={24} /></div>
          <div>
            <strong className="d-block">RouteMate</strong>
            <span className="small text-white-50 text-capitalize">{role} portal</span>
          </div>
        </div>
        <nav className="nav nav-pills flex-column gap-2">
          {roleLinks.map(([label, to, Icon]) => (
            <NavLink key={to} className={({ isActive }) => `nav-link d-flex align-items-center gap-2 ${isActive ? "active" : "text-white"}`} to={to}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="mt-auto pt-4 border-top border-light border-opacity-25">
        <strong className="d-block">{user?.name}</strong>
        <span className="small text-white-50 d-block mb-2">{user?.email}</span>
        <button className="btn btn-light btn-sm" onClick={logout}>Logout</button>
      </div>
    </aside>
  );
}
