import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function DriverLayout() {
  return (
    <div className="app-shell">
      <Sidebar role="driver" />
      <main className="workspace p-4 p-lg-5"><Outlet /></main>
    </div>
  );
}
