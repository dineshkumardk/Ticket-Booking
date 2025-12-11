import { Routes, Route } from "react-router-dom";
import ShowListPage from "../pages/ShowListPage";
import BookingPage from "../pages/BookingPage";
import AdminPage from "../pages/AdminPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ShowListPage />} />
      <Route path="/booking/:id" element={<BookingPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}