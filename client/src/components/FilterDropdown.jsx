export default function FilterDropdown({ options, selectedValue, onChange, label = "Filter" }) {
  return (
    <select className="form-select" aria-label={label} value={selectedValue} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => (
        <option key={option.value || option} value={option.value || option}>
          {option.label || option}
        </option>
      ))}
    </select>
  );
}
