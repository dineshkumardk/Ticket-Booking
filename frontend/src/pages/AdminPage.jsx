import { useShows } from "../context/useShows";
import { useState } from "react";
import { api } from "../api/api";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

export default function AdminPage() {
  const [form, setForm] = useState({
    name: "",
    start_time: "",
    total_seats: 40
  });

  const data = useShows();
  
  if (!data) {
    return <div style={{ padding: 20, color: "red" }}>Error: ShowContext not initialized</div>;
  }

  const { shows, refresh, loading } = data;

  async function submit(e) {
    e.preventDefault();
    await api.createShow(form);
    setForm({ name: "", start_time: "", total_seats: 40 });
    refresh();
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Admin Panel</h1>
        <Link to="/"><button>Home</button></Link>
      </div>

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", width: 300 }}>
        <input
          placeholder="Show name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="datetime-local"
          value={form.start_time}
          onChange={(e) => setForm({ ...form, start_time: e.target.value })}
        />
        <input
          type="number"
          value={form.total_seats}
          onChange={(e) => setForm({ ...form, total_seats: Number(e.target.value) })}
        />

        <button type="submit">Create Show</button>
      </form>

      <h2>Existing Shows</h2>

      {loading ? (
        <Loader />
      ) : (
        shows.map((s) => (
          <div key={s._id} style={{ borderBottom: "1px solid #ddd", padding: 5 }}>
            {s.name} — {new Date(s.start_time).toLocaleString()}
          </div>
        ))
      )}
    </div>
  );
}