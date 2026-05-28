import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "../../api/api";
import DataTable from "../../components/DataTable";
import FilterDropdown from "../../components/FilterDropdown";
import { bookingStatuses } from "../../utils/constants";
import { PageTitle } from "../passenger/PassengerDashboard";
import { Inbox, Check, X, Car, User, Loader } from "lucide-react";

export default function BookingRequests() {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("all");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const pollRef = useRef(null);

  const load = useCallback((silent = false) => {
    if (!silent) setLoading(true);
    api.get("/bookings/driver")
      .then((data) => {
        const fetched = data || [];
        setBookings(fetched);
        if (!silent) setLoading(false);
        // Auto-poll only while there are accepted bookings (30s timer is live)
        const hasAccepted = fetched.some((b) => b.status === "accepted");
        if (hasAccepted && !pollRef.current) {
          pollRef.current = setInterval(() => {
            api.get("/bookings/driver").then((d) => {
              const updated = d || [];
              setBookings(updated);
              const stillAccepted = updated.some((b) => b.status === "accepted");
              if (!stillAccepted && pollRef.current) {
                clearInterval(pollRef.current);
                pollRef.current = null;
              }
            }).catch(() => {});
          }, 5000);
        } else if (!hasAccepted && pollRef.current) {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
      })
      .catch((err) => {
        setMessage(err.message);
        if (!silent) setLoading(false);
      });
  }, []);

  useEffect(() => {
    load();
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [load]);

  const filtered = useMemo(() => bookings.filter((booking) => status === "all" || booking.status === status), [bookings, status]);

  async function update(id, nextStatus) {
    try {
      await api.patch(`/bookings/${id}`, { status: nextStatus });
      load();
    } catch (err) {
      setMessage(err.message);
    }
  }

  const renderStatusBadge = (statusValue) => {
    const styles = {
      pending: { bg: "rgba(242, 193, 78, 0.15)", color: "#a07000", label: "Pending" },
      accepted: { bg: "rgba(0, 123, 255, 0.15)", color: "#0056b3", label: "Accepted" },
      rejected: { bg: "rgba(220, 53, 69, 0.15)", color: "#a51d24", label: "Rejected" },
      completed: { bg: "rgba(44, 125, 105, 0.15)", color: "#1f5c4c", label: "Completed" }
    };
    const style = styles[statusValue] || { bg: "rgba(108, 117, 125, 0.15)", color: "#495057", label: statusValue };
    return (
      <span 
        className="badge px-3 py-2 text-capitalize rounded-pill fw-semibold border-0" 
        style={{ backgroundColor: style.bg, color: style.color, fontSize: "0.85rem" }}
      >
        {style.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <Loader className="animate-spin text-success mb-3" size={40} style={{ animation: "spin 1s linear infinite" }} />
        <span className="text-secondary fw-medium">Loading requests...</span>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}} />
      </div>
    );
  }

  return (
    <>
      <PageTitle title="Booking Requests" copy="Manage passenger reservations, accept or reject incoming ride requests." />
      {message && <div className="alert alert-danger shadow-sm border-0 mb-4">{message}</div>}

      {bookings.length === 0 ? (
        <div className="card border-0 shadow-lg p-5 text-center mt-3 hero-band position-relative overflow-hidden" style={{ borderRadius: "1.25rem" }}>
          <div className="position-absolute top-0 start-50 translate-middle-x bg-success-subtle opacity-50 rounded-circle" style={{ width: "300px", height: "300px", filter: "blur(80px)", zIndex: 0 }} />
          <div className="position-relative" style={{ zIndex: 1 }}>
            <div className="d-inline-flex align-items-center justify-content-center bg-white shadow-md p-4 rounded-circle mb-4 text-success border border-light" style={{ width: "90px", height: "90px" }}>
              <Inbox size={44} className="opacity-80" />
            </div>
            <h2 className="fw-bold mb-3" style={{ color: "#18332e" }}>No Booking Requests Yet!</h2>
            <p className="text-secondary mx-auto mb-4" style={{ maxWidth: "480px", fontSize: "1.1rem" }}>
              Your ride list is active but you don't have any passenger reservations at the moment. As soon as passengers book seats, they will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: "1rem" }}>
          <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
            <div className="row align-items-center g-3">
              <div className="col-md-8">
                <h3 className="h5 mb-0 fw-bold text-dark">Passenger Reservations ({bookings.length})</h3>
                <span className="small text-muted">Review, accept, or reject incoming requests</span>
              </div>
              <div className="col-md-4 text-end">
                <FilterDropdown options={bookingStatuses} selectedValue={status} onChange={setStatus} />
              </div>
            </div>
          </div>
          <div className="card-body px-4 pb-4 pt-3">
            {filtered.length === 0 ? (
              <div className="text-center py-5 text-secondary border border-dashed rounded-3 mt-3 bg-light">
                <Inbox size={36} className="mb-2 opacity-50" />
                <p className="mb-0 fw-medium">No bookings match the selected status filter.</p>
              </div>
            ) : (
              <DataTable 
                columns={[
                  { 
                    key: "passenger", 
                    label: "Passenger", 
                    render: (booking) => (
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-success-subtle text-success p-2.5 rounded-circle d-flex align-items-center justify-content-center" style={{ width: "42px", height: "42px" }}>
                          <User size={20} />
                        </div>
                        <div>
                          <div className="fw-bold text-dark mb-0.5">{booking.passenger?.name || "Passenger"}</div>
                          <span className="small text-muted">{booking.passenger?.email || "No email"}</span>
                        </div>
                      </div>
                    )
                  },
                  { 
                    key: "ride", 
                    label: "Ride / Route", 
                    render: (booking) => (
                      <div>
                        <div className="fw-semibold text-dark">{booking.ride?.origin} to {booking.ride?.destination}</div>
                        <span className="small text-muted">{booking.ride?.date ? new Date(booking.ride.date).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' }) : "No Date"} • {booking.ride?.time || "N/A"}</span>
                      </div>
                    )
                  },
                  { 
                    key: "status", 
                    label: "Status", 
                    render: (booking) => renderStatusBadge(booking.status) 
                  },
                  { 
                    key: "actions", 
                    label: "Actions", 
                    render: (booking) => (
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-outline-success btn-sm px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1" 
                          disabled={booking.status !== "pending"}
                          onClick={() => update(booking._id, "accepted")}
                        >
                          <Check size={16} /> Accept
                        </button>
                        <button 
                          className="btn btn-outline-danger btn-sm px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1" 
                          disabled={booking.status !== "pending"}
                          onClick={() => update(booking._id, "rejected")}
                        >
                          <X size={16} /> Reject
                        </button>
                      </div>
                    ) 
                  },
                ]} 
                data={filtered} 
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
