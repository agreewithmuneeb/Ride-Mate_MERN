import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { validateRide } from "../../utils/validators";
import { PageTitle } from "../passenger/PassengerDashboard";
import { ShieldAlert } from "lucide-react";

const initialRide = { origin: "", destination: "", date: "", seats: 1, price: 300, isActive: true };

export default function CreateRide() {
  return <RideFormPage title="Create Ride" mode="create" />;
}

export function RideFormPage({ title, mode, initial = initialRide, rideId }) {
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  async function submit(event) {
    event.preventDefault();
    const validation = validateRide(form);
    if (validation) return setMessage(validation);
    try {
      if (mode === "edit") {
        await api.put(`/rides/${rideId}`, { ...form, seats: Number(form.seats), price: Number(form.price), isActive: form.isActive });
        setMessage("Ride updated successfully");
      } else {
        await api.post("/rides", { ...form, seats: Number(form.seats), price: Number(form.price), isActive: form.isActive });
        navigate("/driver/my-rides");
      }
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <>
      <PageTitle title={title} copy="Publish route, date, seats, price, and visibility status for passengers." />
      
      {!user?.isVerified && (
        <div className="alert alert-warning border-0 shadow-sm px-4 py-3 mb-4 d-flex align-items-center gap-3" style={{ borderRadius: "0.75rem" }}>
          <ShieldAlert size={24} className="text-warning flex-shrink-0" />
          <div>
            <div className="fw-bold text-warning-emphasis">Driver Verification Required</div>
            <div className="small text-warning-emphasis">You need to submit your CNIC in the Verification page to publish or manage rides.</div>
          </div>
        </div>
      )}

      {message && <div className="alert alert-info border-0 shadow-sm mb-4">{message}</div>}

      <div className="card border-0 shadow-sm" style={{ borderRadius: "1.25rem" }}>
        <div className="card-body p-4">
          <form className="row g-3" onSubmit={submit}>
            <div className="col-md-6">
              <label className="form-label small fw-bold text-muted">Origin</label>
              <input className="form-control" placeholder="Origin city" value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} disabled={!user?.isVerified} />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold text-muted">Destination</label>
              <input className="form-control" placeholder="Destination city" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} disabled={!user?.isVerified} />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold text-muted">Departure Date & Time</label>
              <input className="form-control" type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} disabled={!user?.isVerified} />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-bold text-muted">Available Seats</label>
              <input className="form-control" type="number" min="1" placeholder="Seats" value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} disabled={!user?.isVerified} />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-bold text-muted">Seat Price (PKR)</label>
              <input className="form-control" type="number" min="0" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} disabled={!user?.isVerified} />
            </div>

            <div className="col-12 mt-3">
              <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-light border shadow-sm">
                <div className="form-check form-switch fs-5 mb-0">
                  <input 
                    className="form-check-input text-success" 
                    type="checkbox" 
                    id="isActiveToggle" 
                    checked={form.isActive} 
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })} 
                    disabled={!user?.isVerified}
                    style={{ cursor: "pointer" }}
                  />
                  <label className="form-check-label fw-bold text-dark fs-6" htmlFor="isActiveToggle" style={{ cursor: "pointer" }}>
                    Ride Visibility Status
                  </label>
                </div>
                <div className="vr d-none d-sm-block" style={{ height: "30px" }} />
                <span 
                  className={`badge px-3 py-2 rounded-pill fw-semibold border-0 text-capitalize`}
                  style={{ 
                    backgroundColor: form.isActive ? "rgba(44, 125, 105, 0.15)" : "rgba(108, 117, 125, 0.15)",
                    color: form.isActive ? "#1f5c4c" : "#495057",
                    fontSize: "0.85rem"
                  }}
                >
                  {form.isActive ? 'Active / Live' : 'Inactive / Offline'}
                </span>
              </div>
            </div>

            <div className="col-12 mt-4">
              <button className="btn btn-success fw-bold px-4 py-2.5" disabled={!user?.isVerified} style={{ borderRadius: "0.5rem" }}>
                {mode === "edit" ? "Update Ride Settings" : "Publish Ride"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
