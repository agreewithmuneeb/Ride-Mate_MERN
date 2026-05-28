import { Car, LogOut } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const isLoggedIn = Boolean(user && token);

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold" to="/">
          <span className="brand-mark-sm d-inline-flex align-items-center justify-content-center rounded-2"><Car size={18} /></span>
          RouteMate
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#publicNav">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="publicNav">
          <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <NavLink className="nav-link" to="/about">About</NavLink>
            <NavLink className="nav-link" to="/services">Services</NavLink>
            {isLoggedIn ? (
              <>
                <NavLink className="btn btn-success btn-sm" to={`/${user.role}/dashboard`}>Dashboard</NavLink>
                <button className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1" onClick={logout}>
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <NavLink className="nav-link" to="/login">Login</NavLink>
                <NavLink className="btn btn-success btn-sm" to="/register">Register</NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
