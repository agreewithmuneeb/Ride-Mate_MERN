import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../api/api";
import Loader from "../../components/Loader";
import { PageTitle } from "./PassengerDashboard";

export default function RideDetails() {
  const { id } = useParams();
  const [ride, setRide] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get(`/rides/${id}`).then(setRide).catch((err) => setMessage(err.message));
  }, [id]);

  async function bookRide() {
    try {
      await api.post("/bookings", { rideId: id });
      setMessage("Booking request sent");
    } catch (err) {
      setMessage(err.message);
    }
  }

  if (!ride && !message) return <Loader />;

  return (
    <>
      <PageTitle title="Ride Details" copy="Review route information before booking." />
      {message && <div className="alert alert-info">{message}</div>}
      {ride && (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <h2>{ride.origin} to {ride.destination}</h2>
            <p className="text-secondary">Driver: {ride.driver?.name || "Driver"}</p>
            <div className="row g-3 mb-4">
              <div className="col-md-4"><strong>Date</strong><div>{new Date(ride.date).toLocaleString()}</div></div>
              <div className="col-md-4"><strong>Seats</strong><div>{ride.seats}</div></div>
              <div className="col-md-4"><strong>Price</strong><div>Rs. {ride.price}</div></div>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-success" disabled={ride.seats < 1} onClick={bookRide}>Book Ride</button>
              <Link className="btn btn-outline-secondary" to="/passenger/rides">Back</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
