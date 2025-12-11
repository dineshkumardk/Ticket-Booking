import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ShowProvider } from "./context/ShowContext.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ShowProvider>
          <AppRoutes />
        </ShowProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}