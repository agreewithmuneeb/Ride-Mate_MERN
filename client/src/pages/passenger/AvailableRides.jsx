import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/api";
import FilterDropdown from "../../components/FilterDropdown";
import RideCard from "../../components/RideCard";
import SearchBar from "../../components/SearchBar";
import { PageTitle } from "./PassengerDashboard";

export default function AvailableRides() {
  const [rides, setRides] = useState([]);
  const [search, setSearch] = useState("");
  const [seatFilter, setSeatFilter] = useState("all");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/rides").then(setRides).catch((err) => setMessage(err.message));
  }, []);

  const filtered = useMemo(() => rides.filter((ride) => {
    const text = `${ride.origin} ${ride.destination}`.toLowerCase();
    const matchesSearch = text.includes(search.toLowerCase());
    const matchesSeats = seatFilter === "all" || Number(ride.seats) >= Number(seatFilter);
    return matchesSearch && matchesSeats;
  }), [rides, search, seatFilter]);

  async function bookRide(rideId) {
    try {
      await api.post("/bookings", { rideId });
      setMessage("Booking request sent");
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <>
      <PageTitle title="Available Rides" copy="Search by route and request seats from verified drivers." />
      {message && <div className="alert alert-info">{message}</div>}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body row g-3">
          <div className="col-md-8"><SearchBar value={search} onChange={setSearch} placeholder="Search origin or destination" /></div>
          <div className="col-md-4">
            <FilterDropdown label="Seat filter" selectedValue={seatFilter} onChange={setSeatFilter} options={[
              { value: "all", label: "All seats" },
              { value: "1", label: "At least 1 seat" },
              { value: "2", label: "At least 2 seats" },
              { value: "4", label: "At least 4 seats" },
            ]} />
          </div>
        </div>
      </div>
      <div className="row g-3">
        {filtered.map((ride) => (
          <div className="col-md-6 col-xl-4" key={ride._id}>
            <RideCard ride={ride} action={<button className="btn btn-success btn-sm" disabled={ride.seats < 1} onClick={() => bookRide(ride._id)}>Book</button>} />
          </div>
        ))}
        {filtered.length === 0 && <div className="col-12"><div className="card card-body text-center text-secondary">No rides match your filters.</div></div>}
      </div>
    </>
  );
}
