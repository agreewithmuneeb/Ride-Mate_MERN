import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function AdminLayout() {
  return (
    <div className="app-shell">
      <Sidebar role="admin" />
      <main className="workspace p-4 p-lg-5"><Outlet /></main>
    </div>
  );
}
