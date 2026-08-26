import { useState } from "react";

const emptyForm = {
  address: "",
  unit: "",
  city: "",
  state: "",
  zip_code: "",
  bedrooms: "1",
  bathrooms: "1",
  square_feet: "",
  rent: "",
  available: true,
};

export default function PropertyForm({ onSubmit }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await onSubmit(form);
      setForm(emptyForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="property-form" onSubmit={handleSubmit}>
      <h2>Add a property</h2>
      {error && <p className="error">{error}</p>}

      <div className="form-grid">
        <input placeholder="Address" value={form.address} onChange={handleChange("address")} required />
        <input placeholder="Unit (optional)" value={form.unit} onChange={handleChange("unit")} />
        <input placeholder="City" value={form.city} onChange={handleChange("city")} required />
        <input placeholder="State (e.g. TX)" value={form.state} onChange={handleChange("state")} maxLength={2} required />
        <input placeholder="Zip code" value={form.zip_code} onChange={handleChange("zip_code")} required />
        <input type="number" min="0" placeholder="Bedrooms" value={form.bedrooms} onChange={handleChange("bedrooms")} required />
        <input type="number" min="0" step="0.5" placeholder="Bathrooms" value={form.bathrooms} onChange={handleChange("bathrooms")} required />
        <input type="number" min="0" placeholder="Square feet" value={form.square_feet} onChange={handleChange("square_feet")} />
        <input type="number" min="0" step="1" placeholder="Rent ($/mo)" value={form.rent} onChange={handleChange("rent")} required />
        <label className="checkbox">
          <input type="checkbox" checked={form.available} onChange={handleChange("available")} />
          Available
        </label>
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : "Add property"}
      </button>
    </form>
  );
}
