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
      // Reload the seats after booking
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