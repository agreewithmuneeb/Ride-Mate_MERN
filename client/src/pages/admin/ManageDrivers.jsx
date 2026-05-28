import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/api";
import DataTable from "../../components/DataTable";
import FilterDropdown from "../../components/FilterDropdown";
import SearchBar from "../../components/SearchBar";
import { PageTitle } from "../passenger/PassengerDashboard";

export default function ManageDrivers() {
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("");

  const load = async () => {
    try {
      const [driverData, queue] = await Promise.all([api.get("/admin/drivers"), api.get("/verification/queue")]);
      const pendingIds = new Set(queue.map((user) => user._id));
      setDrivers(driverData.map((driver) => ({ ...driver, isPending: pendingIds.has(driver._id) })));
    } catch (err) {
      setMessage(err.message);
    }
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => drivers.filter((driver) => {
    const matchesSearch = `${driver.name} ${driver.email}`.toLowerCase().includes(search.toLowerCase());
    const status = driver.isVerified ? "verified" : driver.isPending ? "pending" : "unverified";
    return matchesSearch && (filter === "all" || filter === status);
  }), [drivers, search, filter]);

  async function review(driver, action) {
    try {
      await api.patch(`/verification/${driver._id}/${action}`, {});
      load();
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <>
      <PageTitle title="Manage Drivers" copy="Approve or reject driver verification requests." />
      {message && <div className="alert alert-info">{message}</div>}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="row g-2 mb-3">
            <div className="col-md-8"><SearchBar value={search} onChange={setSearch} placeholder="Search drivers" /></div>
            <div className="col-md-4"><FilterDropdown selectedValue={filter} onChange={setFilter} options={["all", "verified", "pending", "unverified"]} /></div>
          </div>
          <DataTable columns={[
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "status", label: "Status", render: (driver) => <span className={`badge ${driver.isVerified ? "text-bg-success" : driver.isPending ? "text-bg-warning" : "text-bg-secondary"}`}>{driver.isVerified ? "Verified" : driver.isPending ? "Pending" : "Unverified"}</span> },
            { key: "cnic", label: "CNIC", render: (driver) => driver.cnicImage || "None" },
            { key: "actions", label: "Actions", render: (driver) => <div className="d-flex gap-2"><button className="btn btn-outline-success btn-sm" disabled={!driver.cnicImage} onClick={() => review(driver, "approve")}>Approve</button><button className="btn btn-outline-danger btn-sm" disabled={!driver.cnicImage} onClick={() => review(driver, "reject")}>Reject</button></div> },
          ]} data={filtered} />
        </div>
      </div>
    </>
  );
}
