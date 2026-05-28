import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function PublicLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer className="border-top bg-white py-4">
        <div className="container text-secondary small">RouteMate MERN intercity rideshare platform</div>
      </footer>
    </>
  );
}
