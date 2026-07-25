import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import Navbar from "./Navbar";

export default function RotaProtegida() {
  const { usuario } = useAuth();

  if (!usuario) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}