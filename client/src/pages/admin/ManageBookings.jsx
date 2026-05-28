import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/api";
import ConfirmDialog from "../../components/ConfirmDialog";
import DataTable from "../../components/DataTable";
import FilterDropdown from "../../components/FilterDropdown";
import { bookingStatuses } from "../../utils/constants";
import { PageTitle } from "../passenger/PassengerDashboard";

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");

  const load = () => api.get("/bookings/admin").then(setBookings).catch((err) => setMessage(err.message));
  useEffect(load, []);

  const filtered = useMemo(() => bookings.filter((booking) => status === "all" || booking.status === status), [bookings, status]);

  async function deleteBooking() {
    try {
      await api.delete(`/bookings/${selected._id}`);
      setSelected(null);
      load();
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <>
      <PageTitle title="Manage Bookings" copy="Review all passenger booking requests and statuses." />
      {message && <div className="alert alert-info">{message}</div>}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="row mb-3"><div className="col-md-4"><FilterDropdown options={bookingStatuses} selectedValue={status} onChange={setStatus} /></div></div>
          <DataTable columns={[
            { key: "passenger", label: "Passenger", render: (booking) => booking.passenger?.name || "Passenger" },
            { key: "driver", label: "Driver", render: (booking) => booking.ride?.driver?.name || "Driver" },
            { key: "route", label: "Ride", render: (booking) => `${booking.ride?.origin || ""} to ${booking.ride?.destination || ""}` },
            { key: "status", label: "Status", render: (booking) => <span className="badge text-bg-secondary text-capitalize">{booking.status}</span> },
            { key: "actions", label: "Actions", render: (booking) => <button className="btn btn-outline-danger btn-sm" onClick={() => setSelected(booking)}>Delete</button> },
          ]} data={filtered} />
        </div>
      </div>
      <ConfirmDialog show={Boolean(selected)} title="Delete booking?" message="This booking record will be removed." onCancel={() => setSelected(null)} onConfirm={deleteBooking} />
    </>
  );
}
