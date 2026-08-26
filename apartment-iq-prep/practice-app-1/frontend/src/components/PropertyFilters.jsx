export default function PropertyFilters({ filters, onChange }) {
  const handleChange = (field) => (event) => {
    onChange({ ...filters, [field]: event.target.value });
  };

  return (
    <form className="filters" onSubmit={(event) => event.preventDefault()}>
      <input
        type="text"
        placeholder="City"
        value={filters.city}
        onChange={handleChange("city")}
      />
      <select value={filters.min_bedrooms} onChange={handleChange("min_bedrooms")}>
        <option value="">Any bedrooms</option>
        <option value="0">Studio+</option>
        <option value="1">1+</option>
        <option value="2">2+</option>
        <option value="3">3+</option>
        <option value="4">4+</option>
      </select>
      <input
        type="number"
        placeholder="Max rent"
        value={filters.max_rent}
        onChange={handleChange("max_rent")}
      />
      <label className="checkbox">
        <input
          type="checkbox"
          checked={filters.available === "true"}
          onChange={(event) => onChange({ ...filters, available: event.target.checked ? "true" : "" })}
        />
        Available only
      </label>
    </form>
  );
}
