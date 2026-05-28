export default function DataTable({ columns, data, emptyText = "No records found" }) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead>
          <tr>
            {columns.map((column) => <th key={column.key}>{column.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row._id || row.id}>
              {columns.map((column) => <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>)}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="text-center text-secondary py-4">{emptyText}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
