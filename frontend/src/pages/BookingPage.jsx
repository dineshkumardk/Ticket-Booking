import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/api";
import SeatGrid from "../components/SeatGrid";
import Loader from "../components/Loader";

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  // ⭐ Ticket Count Logic
  const bookedCount = seats.filter(s => s.status !== "AVAILABLE").length;
  const availableCount = seats.length - bookedCount;

  useEffect(() => {
    let isMounted = true;
    
    const load = async () => {
      const data = await api.getShow(id);
      if (isMounted) {
        setShow(data.show);
        setSeats(data.seats);
        setLoading(false);
      }
    };
    
    load();
    
    return () => {
      isMounted = false;
    };
  }, [id]);

  function toggleSeat(n) {
    setSelected((prev) =>
      prev.includes(n) ? prev.filter((s) => s !== n) : [...prev, n]
    );
  }

  async function confirmBooking() {
    try {
      await api.bookSeats(id, selected);
      setMsg("Booking Successful!");
      setSelected([]);
      const data = await api.getShow(id);
      setShow(data.show);
      setSeats(data.seats);
    } catch (err) {
      setMsg(err.body?.error || "Booking failed");
    }
  }

  if (loading) return <Loader />;

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => navigate(-1)}>Back</button>

      <h2>{show.name}</h2>
      <p>Start: {new Date(show.start_time).toLocaleString()}</p>

      {/* ⭐ Ticket Count */}
      <div style={{ marginTop: 10, display: "flex", gap: "20px", fontSize: 16 }}>
        <div><b>Total:</b> {seats.length}</div>
        <div><b>Booked:</b> {bookedCount}</div>
        <div><b>Available:</b> {availableCount}</div>
        <div><b>Selected:</b> {selected.length}</div>
      </div>

      {/* ⭐ Seat Legend */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "15px",
          fontSize: "14px",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: 20, height: 20, background: "#3b82f6", borderRadius: 4 }}></div>
          Available
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: 20, height: 20, background: "#ef4444", borderRadius: 4 }}></div>
          Booked
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: 20, height: 20, background: "#10b981", borderRadius: 4 }}></div>
          Selected
        </div>
      </div>

      <SeatGrid seats={seats} selected={selected} onToggle={toggleSeat} />

      <button
        style={{ marginTop: 20 }}
        disabled={selected.length === 0}
        onClick={confirmBooking}
      >
        Confirm Booking
      </button>

      {msg && <p>{msg}</p>}
    </div>
  );
}