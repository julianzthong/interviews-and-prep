const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function PropertyList({ properties, onDelete }) {
  if (properties.length === 0) {
    return <p className="empty-state">No properties match those filters.</p>;
  }

  return (
    <table className="property-table">
      <thead>
        <tr>
          <th>Address</th>
          <th>City</th>
          <th>Beds</th>
          <th>Baths</th>
          <th>Sqft</th>
          <th>Rent</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {properties.map((property) => (
          <tr key={property.id}>
            <td>{property.address}{property.unit ? `, ${property.unit}` : ""}</td>
            <td>{property.city}, {property.state}</td>
            <td>{property.bedrooms}</td>
            <td>{property.bathrooms}</td>
            <td>{property.square_feet ?? "—"}</td>
            <td>{currency.format(property.rent)}</td>
            <td>
              <span className={`badge ${property.available ? "badge-available" : "badge-unavailable"}`}>
                {property.available ? "Available" : "Leased"}
              </span>
            </td>
            <td>
              <button className="link-button" onClick={() => onDelete(property.id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
