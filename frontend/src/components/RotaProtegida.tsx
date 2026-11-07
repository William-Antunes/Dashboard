import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import Sidebar from "./Sidebar";

export default function RotaProtegida() {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return <p className="p-6 text-sm text-lapis">Carregando...</p>;
  }

  if (!usuario) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar />
      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-[960px] px-4 py-8 sm:px-8 lg:py-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
