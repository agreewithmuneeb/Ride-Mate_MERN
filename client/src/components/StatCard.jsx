export default function StatCard({ title, value, icon: Icon, tone = "success" }) {
  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body d-flex align-items-center justify-content-between gap-3">
        <div>
          <p className="text-secondary mb-1">{title}</p>
          <h3 className="mb-0 fw-bold">{value}</h3>
        </div>
        {Icon && <Icon className={`text-${tone}`} size={30} />}
      </div>
    </div>
  );
}
