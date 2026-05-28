import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/api";
import ConfirmDialog from "../../components/ConfirmDialog";
import DataTable from "../../components/DataTable";
import SearchBar from "../../components/SearchBar";
import { PageTitle } from "../passenger/PassengerDashboard";

export default function ManageRides() {
  const [rides, setRides] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");

  const load = () => api.get("/rides").then(setRides).catch((err) => setMessage(err.message));
  useEffect(load, []);

  const filtered = useMemo(() => rides.filter((ride) => `${ride.origin} ${ride.destination} ${ride.driver?.name || ""}`.toLowerCase().includes(search.toLowerCase())), [rides, search]);

  async function deleteRide() {
    try {
      await api.delete(`/rides/${selected._id}`);
      setSelected(null);
      load();
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <>
      <PageTitle title="Manage Rides" copy="View and remove inappropriate ride listings." />
      {message && <div className="alert alert-info">{message}</div>}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="mb-3"><SearchBar value={search} onChange={setSearch} placeholder="Search rides" /></div>
          <DataTable columns={[
            { key: "route", label: "Route", render: (ride) => `${ride.origin} to ${ride.destination}` },
            { key: "driver", label: "Driver", render: (ride) => ride.driver?.name || "Driver" },
            { key: "date", label: "Date", render: (ride) => new Date(ride.date).toLocaleString() },
            { key: "seats", label: "Seats" },
            { key: "actions", label: "Actions", render: (ride) => <button className="btn btn-outline-danger btn-sm" onClick={() => setSelected(ride)}>Delete</button> },
          ]} data={filtered} />
        </div>
      </div>
      <ConfirmDialog show={Boolean(selected)} title="Delete ride?" message="This removes the ride and all related bookings." onCancel={() => setSelected(null)} onConfirm={deleteRide} />
    </>
  );
}
