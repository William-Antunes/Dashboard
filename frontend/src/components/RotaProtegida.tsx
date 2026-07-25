import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "./Navbar";

export default function RotaProtegida() {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return <p className="p-6 text-gray-400">Carregando...</p>;
  }

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