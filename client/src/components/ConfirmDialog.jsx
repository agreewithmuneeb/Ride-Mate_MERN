export default function ConfirmDialog({ show, title, message, onCancel, onConfirm }) {
  if (!show) return null;

  return (
    <div className="modal-backdrop-lite">
      <div className="card shadow confirm-card">
        <div className="card-body">
          <h2 className="h5">{title}</h2>
          <p className="text-secondary">{message}</p>
          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
            <button className="btn btn-danger" onClick={onConfirm}>Confirm</button>
          </div>
        </div>
      </div>
    </div>
  );
}
