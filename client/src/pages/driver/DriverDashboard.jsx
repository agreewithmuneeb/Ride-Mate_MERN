import { Car, CheckCircle, Clock, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/api";
import StatCard from "../../components/StatCard";
import { PageTitle } from "../passenger/PassengerDashboard";

export default function DriverDashboard() {
  const [rides, setRides] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get("/rides/my").then(setRides).catch(() => setRides([]));
    api.get("/bookings/driver").then(setBookings).catch(() => setBookings([]));
  }, []);

  const pending = bookings.filter((booking) => booking.status === "pending").length;
  const accepted = bookings.filter((booking) => booking.status === "accepted").length;
  const seats = rides.reduce((sum, ride) => sum + Number(ride.seats || 0), 0);

  return (
    <>
      <PageTitle title="Driver Dashboard" copy="Manage rides, seats, and passenger booking requests." />
      <div className="row g-3 mb-4">
        <div className="col-md-3"><StatCard title="My rides" value={rides.length} icon={Car} /></div>
        <div className="col-md-3"><StatCard title="Open seats" value={seats} icon={Users} /></div>
        <div className="col-md-3"><StatCard title="Pending requests" value={pending} icon={Clock} tone="warning" /></div>
        <div className="col-md-3"><StatCard title="Accepted" value={accepted} icon={CheckCircle} /></div>
      </div>
      <Link className="btn btn-success" to="/driver/create-ride">Create Ride</Link>
    </>
  );
}
