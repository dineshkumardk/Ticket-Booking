import { Link } from "react-router-dom";

export default function ShowCard({ show }) {
  return (
    <div className="show-card">
      <h3>{show.name}</h3>
      <p className="meta">
        {new Date(show.start_time).toLocaleString()}
      </p>
      <p className="meta">Seats: {show.total_seats}</p>

      <Link to={`/booking/${show._id}`}>
        <button className="primary" style={{ marginTop: "10px" }}>
          Book Now
        </button>
      </Link>
    </div>
  );
}