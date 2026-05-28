export default function About() {
  return (
    <section className="container py-5">
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4 p-lg-5">
          <p className="eyebrow">Business name</p>
          <h1 className="fw-bold">About RouteMate</h1>
          <p className="lead text-secondary">RouteMate is an intercity rideshare system for passengers who need affordable, verified, scheduled travel between cities while drivers offer their available car seats.</p>
          <div className="row g-4 mt-2">
            <div className="col-md-6">
              <h2 className="h4">Purpose</h2>
              <p className="text-secondary">The platform connects passengers with intercity drivers, reduces empty seats, tracks booking status, and gives administrators a safety workflow for verification.</p>
            </div>
            <div className="col-md-6">
              <h2 className="h4">Actors</h2>
              <p className="text-secondary">Passengers, drivers, and admins each get role-based dashboards with actions matched to their responsibilities.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
