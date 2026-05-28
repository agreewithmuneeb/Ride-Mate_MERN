import { CheckCircle, Clock, TicketCheck, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../../api/api";
import DataTable from "../../components/DataTable";
import StatCard from "../../components/StatCard";
import { PageTitle } from "../passenger/PassengerDashboard";

export default function Reports() {
  const [report, setReport] = useState({ totals: {}, latestBookings: [] });

  useEffect(() => {
    api.get("/admin/reports").then(setReport).catch(() => setReport({ totals: {}, latestBookings: [] }));
  }, []);

  return (
    <>
      <PageTitle title="Reports" copy="Simple statistics and latest booking activity." />
      <div className="row g-3 mb-4">
        <div className="col-md-3"><StatCard title="Total bookings" value={report.totals.totalBookings || 0} icon={TicketCheck} /></div>
        <div className="col-md-3"><StatCard title="Pending" value={report.totals.pendingBookings || 0} icon={Clock} tone="warning" /></div>
        <div className="col-md-3"><StatCard title="Accepted" value={report.totals.acceptedBookings || 0} icon={CheckCircle} /></div>
        <div className="col-md-3"><StatCard title="Rejected" value={report.totals.rejectedBookings || 0} icon={XCircle} tone="danger" /></div>
      </div>
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h2 className="h4">Latest activity</h2>
          <DataTable columns={[
            { key: "passenger", label: "Passenger", render: (booking) => booking.passenger?.name || "Passenger" },
            { key: "route", label: "Ride", render: (booking) => `${booking.ride?.origin || ""} to ${booking.ride?.destination || ""}` },
            { key: "status", label: "Status", render: (booking) => <span className="badge text-bg-secondary text-capitalize">{booking.status}</span> },
          ]} data={report.latestBookings || []} />
        </div>
      </div>
    </>
  );
}
