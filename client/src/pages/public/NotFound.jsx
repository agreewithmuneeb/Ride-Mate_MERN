import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="container py-5 text-center">
      <h1 className="fw-bold">Page Not Found</h1>
      <p className="text-secondary">The page you requested does not exist.</p>
      <Link className="btn btn-success" to="/">Return Home</Link>
    </section>
  );
}
