import { Link } from "react-router-dom";

export default function ShowCard({ show }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "12px",
        borderRadius: "8px",
        margin: "10px",
        width: "260px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <h3>{show.name}</h3>

      <p>
        <strong>Start:</strong> {new Date(show.start_time).toLocaleString()}
      </p>

      <p>
        <strong>Total Seats:</strong> {show.total_seats}
      </p>

      <Link to={`/booking/${show._id}`}>
        <button
          style={{
            marginTop: "10px",
            padding: "8px 12px",
            borderRadius: "6px",
            cursor: "pointer",
            background: "#4caf50",
            border: "none",
            color: "white",
          }}
        >
          Book Now
        </button>
      </Link>
    </div>
  );
}
