import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { PageTitle } from "./PassengerDashboard";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", password: "" });
  const [message, setMessage] = useState("");

  async function submit(event) {
    event.preventDefault();
    try {
      await updateProfile({ ...form, password: form.password || undefined });
      setMessage("Profile updated");
      setForm((current) => ({ ...current, password: "" }));
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <>
      <PageTitle title="Profile" copy="Update your account details." />
      {message && <div className="alert alert-info">{message}</div>}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <form className="vstack gap-3" onSubmit={submit}>
            <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" />
            <input className="form-control" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" />
            <input className="form-control" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="New password optional" />
            <button className="btn btn-success align-self-start">Save Profile</button>
          </form>
        </div>
      </div>
    </>
  );
}
