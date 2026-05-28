import { ClipboardCheck } from "lucide-react";

const services = [
  "User registration and JWT login",
  "Passenger ride search, details, booking, and status tracking",
  "Driver verification, ride creation, ride editing, and booking approvals",
  "Admin user management, driver verification, ride moderation, and reports",
  "MongoDB-backed CRUD with Mongoose schemas",
  "Search, filters, protected routes, reusable components, and Bootstrap UI",
];

export default function Services() {
  return (
    <section className="container py-5">
      <p className="eyebrow">Services offered</p>
      <h1 className="fw-bold mb-4">What RouteMate Provides</h1>
      <div className="row g-3">
        {services.map((service) => (
          <div className="col-md-6 col-lg-4" key={service}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex gap-3">
                <ClipboardCheck className="text-success flex-shrink-0" />
                <span>{service}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
