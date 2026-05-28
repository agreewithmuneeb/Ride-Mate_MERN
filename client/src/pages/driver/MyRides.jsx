import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/api";
import ConfirmDialog from "../../components/ConfirmDialog";
import DataTable from "../../components/DataTable";
import SearchBar from "../../components/SearchBar";
import { PageTitle } from "../passenger/PassengerDashboard";

export default function MyRides() {
  const [rides, setRides] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");

  const load = () => {
    api.get("/rides/my")
      .then(setRides)
      .catch((err) => setMessage(err.message));
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => rides.filter((ride) => `${ride.origin} ${ride.destination}`.toLowerCase().includes(search.toLowerCase())), [rides, search]);

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
      <PageTitle title="My Rides" copy="Search, edit, and delete your published rides." />
      {message && <div className="alert alert-info">{message}</div>}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="row g-2 mb-3">
            <div className="col-md-8"><SearchBar value={search} onChange={setSearch} placeholder="Search my rides" /></div>
            <div className="col-md-4 text-md-end"><Link className="btn btn-success" to="/driver/create-ride">Create Ride</Link></div>
          </div>
          <DataTable columns={[
            { key: "route", label: "Route", render: (ride) => `${ride.origin} to ${ride.destination}` },
            { key: "date", label: "Date", render: (ride) => new Date(ride.date).toLocaleString() },
            { key: "seats", label: "Seats" },
            { key: "price", label: "Price", render: (ride) => `Rs. ${ride.price}` },
            { 
              key: "status", 
              label: "Status", 
              render: (ride) => (
                <span 
                  className="badge px-3 py-2 text-capitalize rounded-pill fw-semibold border-0"
                  style={{
                    backgroundColor: ride.isActive !== false ? "rgba(44, 125, 105, 0.15)" : "rgba(108, 117, 125, 0.15)",
                    color: ride.isActive !== false ? "#1f5c4c" : "#495057",
                    fontSize: "0.85rem"
                  }}
                >
                  {ride.isActive !== false ? "Active" : "Offline"}
                </span>
              )
            },
            { key: "actions", label: "Actions", render: (ride) => <div className="d-flex gap-2"><Link className="btn btn-outline-secondary btn-sm" to={`/driver/rides/${ride._id}/edit`}>Edit</Link><button className="btn btn-outline-danger btn-sm" onClick={() => setSelected(ride)}>Delete</button></div> },
          ]} data={filtered} />
        </div>
      </div>
      <ConfirmDialog show={Boolean(selected)} title="Delete ride?" message="This also deletes related bookings." onCancel={() => setSelected(null)} onConfirm={deleteRide} />
    </>
  );
}
