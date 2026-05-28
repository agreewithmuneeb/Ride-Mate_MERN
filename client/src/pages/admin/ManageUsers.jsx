import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/api";
import ConfirmDialog from "../../components/ConfirmDialog";
import DataTable from "../../components/DataTable";
import FilterDropdown from "../../components/FilterDropdown";
import SearchBar from "../../components/SearchBar";
import { userRoles } from "../../utils/constants";
import { PageTitle } from "../passenger/PassengerDashboard";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");

  const load = () => api.get("/admin/users").then(setUsers).catch((err) => setMessage(err.message));
  useEffect(load, []);

  const filtered = useMemo(() => users.filter((user) => {
    const matchesRole = role === "all" || user.role === role;
    const matchesSearch = `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  }), [users, search, role]);

  async function changeRole(user, nextRole) {
    try {
      await api.patch(`/admin/users/${user._id}/role`, { role: nextRole });
      load();
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function toggleStatus(user) {
    try {
      await api.patch(`/admin/users/${user._id}/status`, { isActive: !user.isActive });
      load();
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function deleteUser() {
    try {
      await api.delete(`/admin/users/${selected._id}`);
      setSelected(null);
      load();
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <>
      <PageTitle title="Manage Users" copy="Search, filter, change roles, disable, or delete users." />
      {message && <div className="alert alert-info">{message}</div>}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="row g-2 mb-3">
            <div className="col-md-8"><SearchBar value={search} onChange={setSearch} placeholder="Search users" /></div>
            <div className="col-md-4"><FilterDropdown options={userRoles} selectedValue={role} onChange={setRole} /></div>
          </div>
          <DataTable columns={[
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "role", label: "Role", render: (user) => <select className="form-select form-select-sm" value={user.role} onChange={(e) => changeRole(user, e.target.value)}><option value="passenger">Passenger</option><option value="driver">Driver</option><option value="admin">Admin</option></select> },
            { key: "status", label: "Status", render: (user) => <span className={`badge ${user.isActive === false ? "text-bg-danger" : "text-bg-success"}`}>{user.isActive === false ? "Disabled" : "Active"}</span> },
            { key: "actions", label: "Actions", render: (user) => <div className="d-flex gap-2"><button className="btn btn-outline-secondary btn-sm" onClick={() => toggleStatus(user)}>{user.isActive === false ? "Enable" : "Disable"}</button><button className="btn btn-outline-danger btn-sm" onClick={() => setSelected(user)}>Delete</button></div> },
          ]} data={filtered} />
        </div>
      </div>
      <ConfirmDialog show={Boolean(selected)} title="Delete user?" message="This removes the user and related rides/bookings." onCancel={() => setSelected(null)} onConfirm={deleteUser} />
    </>
  );
}
