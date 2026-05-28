import { CalendarClock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function RideCard({ ride, action }) {
  return (
    <div className="card h-100 border ride-card">
      <div className="card-body">
        <div className="d-flex align-items-center gap-2 text-secondary small mb-2">
          <MapPin size={16} />
          <span>{ride.origin}</span>
        </div>
        <h3 className="h5">{ride.destination}</h3>
        <div className="d-flex align-items-center gap-2 text-secondary small mb-3">
          <CalendarClock size={16} />
          <span>{ride.date ? new Date(ride.date).toLocaleString() : "No date"}</span>
        </div>
        <div className="d-flex justify-content-between fw-semibold mb-3">
          <span>{ride.seats} seats</span>
          <span>Rs. {ride.price}</span>
        </div>
        <div className="d-flex align-items-center justify-content-between gap-2">
          <span className="small text-secondary">{ride.driver?.name || "Driver"}</span>
          <div className="d-flex gap-2">
            <Link className="btn btn-outline-secondary btn-sm" to={`/passenger/rides/${ride._id}`}>View</Link>
            {action}
          </div>
        </div>
      </div>
    </div>
  );
}
