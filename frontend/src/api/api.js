// src/api.jsx
// tries both names so whichever env you set will work
const BASE =
  import.meta.env.VITE_API_BASE ||
  import.meta.env.VITE_API_URL ||
  "https://ticket-booking-l9aj.onrender.com";

async function safeJson(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text; // return raw text if response is not JSON
  }
}

async function request(path, options = {}) {
  const url = `${BASE}${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  // Debug log (visible in browser console)
  console.debug("[api] ->", options.method || "GET", url);

  let res;
  try {
    // Add timeout for fetch requests (5 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    res = await fetch(url, { ...options, headers, signal: controller.signal });
    clearTimeout(timeoutId);
  } catch (networkErr) {
    if (networkErr.name === 'AbortError') {
      console.error("[api] Request timeout:", url);
      const err = new Error("Request timeout - backend may be unreachable");
      err.cause = networkErr;
      throw err;
    }
    console.error("[api] Network error:", networkErr);
    const err = new Error("Network error: " + networkErr.message);
    err.cause = networkErr;
    throw err;
  }

  const text = await res.text().catch(() => "");
  const data = await safeJson(text);

  // Debug response
  console.debug("[api] <-", { url, status: res.status, ok: res.ok, data });

  if (!res.ok) {
    const message = (data && data.error) || res.statusText || "API error";
    const err = new Error(message);
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