import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { dashboardForRole } from "../../utils/auth";
import { validateAuth } from "../../utils/validators";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "passenger" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, loginWithGoogle, user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && token) {
      navigate(dashboardForRole(user.role), { replace: true });
    }
  }, [user, token, navigate]);

  async function handleGoogleCallback(response) {
    try {
      setLoading(true);
      setError("");
      const user = await loginWithGoogle(response.credential, form.role);
      navigate(dashboardForRole(user.role), { replace: true });
    } catch (err) {
      setError(err.message || "Google Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    /* global google */
    if (typeof window !== "undefined" && window.google) {
      try {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "your-google-client-id-here.apps.googleusercontent.com",
          callback: handleGoogleCallback,
        });
        window.google.accounts.id.renderButton(
          document.getElementById("google-signup-btn"),
          { theme: "outline", size: "large", width: "100%", text: "signup_with" }
        );
      } catch (err) {
        console.error("Failed to initialize Google Auth:", err);
      }
    }
  }, [form.role]); // Reinitialize if role changes to make sure it captures the latest role

  async function submit(event) {
    event.preventDefault();
    const validation = validateAuth(form, true);
    if (validation) return setError(validation);
    try {
      setLoading(true);
      setError("");
      const user = await register(form);
      navigate(dashboardForRole(user.role), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container py-5 auth-container">
      <div className="card border-0 shadow-lg" style={{ borderRadius: "1.25rem" }}>
        <div className="card-body p-5">
          <h1 className="h3 fw-bold mb-4 text-center">Create Account</h1>
          {error && <div className="alert alert-danger border-0 shadow-sm mb-4">{error}</div>}
          <form onSubmit={submit} className="vstack gap-3">
            <input className="form-control" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="form-control" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="form-control" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            
            <div className="col-12">
              <label className="form-label small fw-semibold text-secondary">Choose Account Role</label>
              <select className="form-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="passenger">Passenger (Find rides)</option>
                <option value="driver">Driver (Offer rides)</option>
              </select>
            </div>

            <button className="btn btn-success mt-2" disabled={loading}>{loading ? "Creating..." : "Register"}</button>
            
            <div className="d-flex align-items-center my-2">
              <hr className="flex-grow-1 text-black-50 opacity-25" />
              <span className="mx-3 text-secondary small fw-medium">or</span>
              <hr className="flex-grow-1 text-black-50 opacity-25" />
            </div>

            <div id="google-signup-btn" className="w-100" style={{ minHeight: "44px" }} />

            <div className="text-center mt-2">
              <Link className="text-success text-decoration-none fw-medium" to="/login">Already have an account? Log in</Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

