import { Car, ShieldCheck, TicketCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../../api/api";
import StatCard from "../../components/StatCard";
import { PageTitle } from "../passenger/PassengerDashboard";

export default function AdminDashboard() {
  const [totals, setTotals] = useState({});

  useEffect(() => {
    api.get("/admin/reports").then((data) => setTotals(data.totals || {})).catch(() => setTotals({}));
  }, []);

  return (
    <>
      <PageTitle title="Admin Dashboard" copy="Monitor RouteMate users, rides, bookings, and verification requests." />
      <div className="row g-3">
        <div className="col-md-3"><StatCard title="Users" value={totals.totalUsers || 0} icon={Users} /></div>
        <div className="col-md-3"><StatCard title="Drivers" value={totals.totalDrivers || 0} icon={ShieldCheck} /></div>
        <div className="col-md-3"><StatCard title="Rides" value={totals.totalRides || 0} icon={Car} /></div>
        <div className="col-md-3"><StatCard title="Bookings" value={totals.totalBookings || 0} icon={TicketCheck} /></div>
      </div>
    </>
  );
}
