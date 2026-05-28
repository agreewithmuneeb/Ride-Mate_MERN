import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { dashboardForRole } from "../../utils/auth";
import { validateAuth } from "../../utils/validators";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle, user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getRedirectPath = (targetUser) => {
    let target = dashboardForRole(targetUser.role);
    const fromPath = location.state?.from?.pathname;
    if (fromPath && !fromPath.includes("unauthorized") && fromPath !== "/") {
      const pathParts = fromPath.split("/").filter(Boolean);
      const primaryRole = pathParts[0];
      const allowedRoles = ["driver", "passenger", "admin"];
      if (!allowedRoles.includes(primaryRole) || primaryRole === targetUser.role) {
        target = fromPath;
      }
    }
    return target;
  };

  useEffect(() => {
    if (user && token) {
      navigate(getRedirectPath(user), { replace: true });
    }
  }, [user, token, navigate, location]);

  async function handleGoogleCallback(response) {
    try {
      setLoading(true);
      setError("");
      const user = await loginWithGoogle(response.credential);
      navigate(getRedirectPath(user), { replace: true });
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
          document.getElementById("google-signin-btn"),
          { theme: "outline", size: "large", width: "100%", text: "signin_with" }
        );
      } catch (err) {
        console.error("Failed to initialize Google Auth:", err);
      }
    }
  }, []);

  async function submit(event) {
    event.preventDefault();
    const validation = validateAuth(form, false);
    if (validation) return setError(validation);
    try {
      setLoading(true);
      setError("");
      const user = await login(form);
      navigate(getRedirectPath(user), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard title="Login to RouteMate" error={error}>
      <form onSubmit={submit} className="vstack gap-3">
        <input className="form-control" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="form-control" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn btn-success" disabled={loading}>{loading ? "Signing in..." : "Login"}</button>
        
        <div className="d-flex align-items-center my-2">
          <hr className="flex-grow-1 text-black-50 opacity-25" />
          <span className="mx-3 text-secondary small fw-medium">or</span>
          <hr className="flex-grow-1 text-black-50 opacity-25" />
        </div>

        <div id="google-signin-btn" className="w-100" style={{ minHeight: "44px" }} />

        <div className="text-center mt-2">
          <Link className="text-success text-decoration-none fw-medium" to="/register">Need an account? Sign up</Link>
        </div>
      </form>
    </AuthCard>
  );
}

function AuthCard({ title, error, children }) {
  return (
    <section className="container py-5 auth-container">
      <div className="card border-0 shadow-lg" style={{ borderRadius: "1.25rem" }}>
        <div className="card-body p-5">
          <h1 className="h3 fw-bold mb-4 text-center">{title}</h1>
          {error && <div className="alert alert-danger border-0 shadow-sm mb-4">{error}</div>}
          {children}
        </div>
      </div>
    </section>
  );
}

