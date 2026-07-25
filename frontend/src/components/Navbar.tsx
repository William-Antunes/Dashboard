import { Link } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

export default function Navbar() {
  const { usuario, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-gray-900 border-b border-gray-800">
      <div className="flex items-center gap-6">
        <Link to="/" className="font-semibold text-white">
          Dashboard
        </Link>
        <Link to="/disciplinas" className="text-sm text-gray-400 hover:text-blue-400">
          Disciplinas
        </Link>
        <Link to="/trabalhos" className="text-sm text-gray-400 hover:text-blue-400">
          Trabalhos
        </Link>
        <Link to="/provas" className="text-sm text-gray-400 hover:text-blue-400">
          Provas
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400">Olá, {usuario?.nome}</span>
        <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-semibold">
          {usuario?.nome?.charAt(0).toUpperCase()}
        </div>
        <button
          onClick={logout}
          className="text-sm text-gray-500 hover:text-red-400 ml-2"
        >
          Sair
        </button>
      </div>
    </nav>
  );
}