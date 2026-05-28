import { CalendarCheck, Clock, TicketCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/api";
import StatCard from "../../components/StatCard";

export default function PassengerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [rides, setRides] = useState([]);

  useEffect(() => {
    api.get("/bookings/my").then(setBookings).catch(() => setBookings([]));
    api.get("/rides").then(setRides).catch(() => setRides([]));
  }, []);

  const pending = bookings.filter((booking) => booking.status === "pending").length;
  const accepted = bookings.filter((booking) => booking.status === "accepted").length;

  return (
    <>
      <PageTitle title="Passenger Dashboard" copy="Track your bookings and find available city-to-city rides." />
      <div className="row g-3 mb-4">
        <div className="col-md-4"><StatCard title="Total bookings" value={bookings.length} icon={TicketCheck} /></div>
        <div className="col-md-4"><StatCard title="Pending" value={pending} icon={Clock} tone="warning" /></div>
        <div className="col-md-4"><StatCard title="Accepted" value={accepted} icon={CalendarCheck} /></div>
      </div>
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h4 mb-0">Recent rides</h2>
            <Link className="btn btn-success btn-sm" to="/passenger/rides">Browse Rides</Link>
          </div>
          <div className="list-group">
            {rides.slice(0, 5).map((ride) => (
              <Link className="list-group-item list-group-item-action" to={`/passenger/rides/${ride._id}`} key={ride._id}>
                {ride.origin} to {ride.destination} <span className="text-secondary small">Rs. {ride.price}</span>
              </Link>
            ))}
            {rides.length === 0 && <div className="text-secondary">No rides available.</div>}
          </div>
        </div>
      </div>
    </>
  );
}

export function PageTitle({ title, copy }) {
  return (
    <header className="mb-4">
      <p className="eyebrow mb-1">RouteMate</p>
      <h1 className="fw-bold mb-1">{title}</h1>
      <p className="text-secondary mb-0">{copy}</p>
    </header>
  );
}
