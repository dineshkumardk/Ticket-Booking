const BASE = import.meta.env.VITE_API_BASE || "http://localhost:8082";

async function request(path, options = {}) {
  const url = `${BASE}${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  const res = await fetch(url, { ...options, headers });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const err = new Error(data?.error || res.statusText);
    err.status = res.status;
    err.body = data;
    throw err;
  }

  return data;
}

export const api = {
  createShow: (payload) =>
    request("/admin/shows", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  getShows: () => request("/shows"),
  getShow: (id) => request(`/shows/${id}`),

  bookSeats: (id, seats) =>
    request(`/shows/${id}/book`, {
      method: "POST",
      body: JSON.stringify({ seats })
    })
};