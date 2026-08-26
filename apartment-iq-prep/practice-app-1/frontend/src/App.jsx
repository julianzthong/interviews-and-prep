import { useEffect, useState } from "react";
import "./App.css";
import PropertyFilters from "./components/PropertyFilters";
import PropertyList from "./components/PropertyList";
import PropertyForm from "./components/PropertyForm";
import { fetchProperties, createProperty, deleteProperty } from "./api/properties";

const defaultFilters = { city: "", min_bedrooms: "", max_rent: "", available: "" };

function App() {
  const [properties, setProperties] = useState([]);
  const [meta, setMeta] = useState({ page: 1, total_pages: 1 });
  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadProperties = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchProperties({ ...filters, page });
      setProperties(data.properties);
      setMeta(data.meta);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [filters, page]);

  const handleFiltersChange = (next) => {
    setFilters(next);
    setPage(1);
  };

  const handleCreate = async (form) => {
    await createProperty(form);
    setShowForm(false);
    setPage(1);
    await loadProperties();
  };

  const handleDelete = async (id) => {
    await deleteProperty(id);
    await loadProperties();
  };

  return (
    <div className="app">
      <header>
        <h1>ApartmentIQ Practice App</h1>
        <button onClick={() => setShowForm((show) => !show)}>
          {showForm ? "Close" : "Add property"}
        </button>
      </header>

      {showForm && <PropertyForm onSubmit={handleCreate} />}

      <PropertyFilters filters={filters} onChange={handleFiltersChange} />

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <PropertyList properties={properties} onDelete={handleDelete} />

          <div className="pagination">
            <button disabled={meta.page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </button>
            <span>
              Page {meta.page} of {meta.total_pages || 1} ({meta.total_count} total)
            </span>
            <button disabled={meta.page >= meta.total_pages} onClick={() => setPage((p) => p + 1)}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
