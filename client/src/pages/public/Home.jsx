import { Car, ShieldCheck, TicketCheck } from "lucide-react";
import { Link } from "react-router-dom";
import StatCard from "../../components/StatCard";

export default function Home() {
  return (
    <>
      <section className="hero-band py-5">
        <div className="container py-5">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <p className="eyebrow">Intercity rideshare</p>
              <h1 className="display-4 fw-bold">RouteMate</h1>
              <p className="lead text-secondary">A MERN platform where passengers find available seats in cars already traveling from one city to another, verified drivers publish rides, and admins manage platform safety.</p>
              <div className="d-flex gap-2 flex-wrap">
                <Link className="btn btn-success btn-lg" to="/register">Get Started</Link>
                <Link className="btn btn-outline-secondary btn-lg" to="/services">View Services</Link>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <h2 className="h4">Assignment scope</h2>
                  <p className="text-secondary mb-0">Authentication, role dashboards, CRUD operations, MongoDB storage, route protection, fetch API, Bootstrap UI, and dynamic filtering.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="container py-5">
        <div className="row g-3">
          <div className="col-md-4"><StatCard title="Passenger bookings" value="Request seats" icon={TicketCheck} /></div>
          <div className="col-md-4"><StatCard title="Driver tools" value="Manage rides" icon={Car} /></div>
          <div className="col-md-4"><StatCard title="Admin safety" value="Verify users" icon={ShieldCheck} /></div>
        </div>
      </section>
    </>
  );
}
