const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function handleResponse(response) {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message = body.errors ? body.errors.join(", ") : `Request failed (${response.status})`;
    throw new Error(message);
  }
  return response.status === 204 ? null : response.json();
}

export async function fetchProperties(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== "" && value != null)
  );

  const response = await fetch(`${API_URL}/api/v1/properties?${query}`);
  return handleResponse(response);
}

export async function createProperty(property) {
  const response = await fetch(`${API_URL}/api/v1/properties`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ property }),
  });
  return handleResponse(response);
}

export async function deleteProperty(id) {
  const response = await fetch(`${API_URL}/api/v1/properties/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
}
