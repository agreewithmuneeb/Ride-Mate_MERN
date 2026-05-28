import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <section className="container py-5 text-center">
      <h1 className="fw-bold">Unauthorized</h1>
      <p className="text-secondary">Your account does not have access to this page.</p>
      <Link className="btn btn-success" to="/">Go Home</Link>
    </section>
  );
}
