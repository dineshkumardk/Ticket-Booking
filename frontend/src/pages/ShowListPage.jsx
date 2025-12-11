import { useShows } from "../context/useShows";
import ShowCard from "../components/ShowCard";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

export default function ShowListPage() {
  const data = useShows();

  if (!data) {
    return <div style={{ padding: 20, color: "red" }}>Error: ShowContext not initialized</div>;
  }

  const { shows, loading, error } = data;

  if (error) {
    return (
      <div style={{ padding: 20, color: "red" }}>
        <h1>Error Loading Shows</h1>
        <p>{error}</p>
        <p>Make sure the backend is running at: https://ticket-booking-l9aj.onrender.com</p>
      </div>
    );
  }

  if (loading) return <Loader />;

  if (!shows || shows.length === 0) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Available Shows</h1>
        <p>No shows available. <Link to="/admin">Create one in Admin</Link></p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Available Shows</h1>
        <Link to="/admin"><button>Admin</button></Link>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {shows.map((s) => <ShowCard key={s._id} show={s} />)}
      </div>
    </div>
  );
}