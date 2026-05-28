import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarX, Car, Search, ArrowRight, Loader } from "lucide-react";
import { api } from "../../api/api";
import ConfirmDialog from "../../components/ConfirmDialog";
import DataTable from "../../components/DataTable";
import FilterDropdown from "../../components/FilterDropdown";
import { bookingStatuses } from "../../utils/constants";
import { PageTitle } from "./PassengerDashboard";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const pollRef = useRef(null);

  const load = useCallback((silent = false) => {
    if (!silent) setLoading(true);
    api.get("/bookings/my")
      .then((data) => {
        const fetched = data || [];
        setBookings(fetched);
        if (!silent) setLoading(false);
        // Auto-poll only while there are accepted bookings (30s timer is live)
        const hasAccepted = fetched.some((b) => b.status === "accepted");
        if (hasAccepted && !pollRef.current) {
          pollRef.current = setInterval(() => {
            api.get("/bookings/my").then((d) => {
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

  async function removeBooking() {
    try {
      await api.delete(`/bookings/${selected._id}`);
      setSelected(null);
      load();
    } catch (err) {
      setMessage(err.message);
    }
  }

  const renderStatusBadge = (statusValue) => {
    const styles = {
      pending: { bg: "rgba(242, 193, 78, 0.15)", color: "#a07000", label: "Pending Approval" },
      accepted: { bg: "rgba(0, 123, 255, 0.15)", color: "#0056b3", label: "Ride Confirmed" },
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
        <span className="text-secondary fw-medium">Loading your bookings...</span>
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
      <PageTitle title="My Bookings" copy="Track the status of your ride bookings and manage cancellations." />
      {message && <div className="alert alert-danger shadow-sm border-0 mb-4">{message}</div>}

      {bookings.length === 0 ? (
        <div className="card border-0 shadow-lg p-5 text-center mt-3 hero-band position-relative overflow-hidden" style={{ borderRadius: "1.25rem" }}>
          <div className="position-absolute top-0 start-50 translate-middle-x bg-success-subtle opacity-50 rounded-circle" style={{ width: "300px", height: "300px", filter: "blur(80px)", zIndex: 0 }} />
          <div className="position-relative" style={{ zIndex: 1 }}>
            <div className="d-inline-flex align-items-center justify-content-center bg-white shadow-md p-4 rounded-circle mb-4 text-success border border-light" style={{ width: "90px", height: "90px" }}>
              <CalendarX size={44} className="opacity-80" />
            </div>
            <h2 className="fw-bold mb-3" style={{ color: "#18332e" }}>No Bookings Done Yet!</h2>
            <p className="text-secondary mx-auto mb-4" style={{ maxWidth: "480px", fontSize: "1.1rem" }}>
              Your itinerary is currently empty. Browse available city-to-city rides, connect with verified drivers, and book your seat!
            </p>
            <Link to="/passenger/rides" className="btn btn-success btn-lg px-4 py-3 fw-bold shadow-md hover-scale d-inline-flex align-items-center gap-2">
              Browse Rides <ArrowRight size={20} />
            </Link>
          </div>
          <style dangerouslySetInnerHTML={{__html: `
            .hover-scale {
              transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .hover-scale:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 24px rgba(44, 125, 105, 0.25) !important;
            }
          `}} />
        </div>
      ) : (
        <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: "1rem" }}>
          <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
            <div className="row align-items-center g-3">
              <div className="col-md-8">
                <h3 className="h5 mb-0 fw-bold text-dark">Booked Rides ({bookings.length})</h3>
                <span className="small text-muted">Showing rides matching filter status</span>
              </div>
              <div className="col-md-4 text-end">
                <FilterDropdown options={bookingStatuses} selectedValue={status} onChange={setStatus} />
              </div>
            </div>
          </div>
          <div className="card-body px-4 pb-4 pt-3">
            {filtered.length === 0 ? (
              <div className="text-center py-5 text-secondary border border-dashed rounded-3 mt-3 bg-light">
                <Search size={36} className="mb-2 opacity-50" />
                <p className="mb-0 fw-medium">No bookings match the selected status filter.</p>
              </div>
            ) : (
              <DataTable 
                columns={[
                  { 
                    key: "route", 
                    label: "Ride / Route", 
                    render: (booking) => (
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-success-subtle text-success p-2.5 rounded-circle d-flex align-items-center justify-content-center" style={{ width: "42px", height: "42px" }}>
                          <Car size={20} />
                        </div>
                        <div>
                          <div className="fw-bold text-dark mb-0.5">{booking.ride?.origin} to {booking.ride?.destination}</div>
                          <span className="small text-muted">{booking.ride?.date ? new Date(booking.ride.date).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' }) : "No Date"} • {booking.ride?.time || "N/A"}</span>
                        </div>
                      </div>
                    )
                  },
                  { 
                    key: "driver", 
                    label: "Driver Info", 
                    render: (booking) => (
                      <div>
                        <div className="fw-semibold text-dark">{booking.ride?.driver?.name || "Driver"}</div>
                        <span className="small text-muted">Rating: 4.8 ★</span>
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
                      <button 
                        className="btn btn-outline-danger btn-sm px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1.5" 
                        disabled={booking.status === "rejected" || booking.status === "completed"}
                        onClick={() => setSelected(booking)}
                      >
                        Cancel Request
                      </button>
                    ) 
                  },
                ]} 
                data={filtered} 
              />
            )}
          </div>
        </div>
      )}

      <ConfirmDialog 
        show={Boolean(selected)} 
        title="Cancel Booking Request?" 
        message="Are you sure you want to cancel this booking request? This action cannot be undone." 
        onCancel={() => setSelected(null)} 
        onConfirm={removeBooking} 
      />
    </>
  );
}

