import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="flex items-center justify-between px-6 py-3">
        <Link to="/" className="font-semibold text-white">
          Dashboard
        </Link>

        <div className="hidden sm:flex items-center gap-6">
          <Link to="/disciplinas" className="text-sm text-gray-400 hover:text-blue-400">
            Disciplinas
          </Link>
          <Link to="/trabalhos" className="text-sm text-gray-400 hover:text-blue-400">
            Trabalhos
          </Link>
          <Link to="/provas" className="text-sm text-gray-400 hover:text-blue-400">
            Provas
          </Link>
          <Link to="/grade-horaria" className="text-sm text-gray-400 hover:text-blue-400">
            Grade Horária
          </Link>
        </div>

        <div className="hidden sm:flex items-center gap-3">
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

        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className="sm:hidden text-gray-300 text-2xl"
        >
          {menuAberto ? "✕" : "☰"}
        </button>
      </div>

      {menuAberto && (
        <div className="sm:hidden flex flex-col gap-1 px-6 pb-4">
          <Link
            to="/disciplinas"
            onClick={() => setMenuAberto(false)}
            className="text-sm text-gray-300 py-2"
          >
            Disciplinas
          </Link>
          <Link
            to="/trabalhos"
            onClick={() => setMenuAberto(false)}
            className="text-sm text-gray-300 py-2"
          >
            Trabalhos
          </Link>
          <Link
            to="/provas"
            onClick={() => setMenuAberto(false)}
            className="text-sm text-gray-300 py-2"
          >
            Provas
          </Link>
          <Link
            to="/grade-horaria"
            onClick={() => setMenuAberto(false)}
            className="text-sm text-gray-300 py-2"
          >
            Grade Horária
          </Link>
          <div className="border-t border-gray-800 mt-2 pt-2 flex items-center justify-between">
            <span className="text-sm text-gray-400">Olá, {usuario?.nome}</span>
            <button onClick={logout} className="text-sm text-red-400">
              Sair
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}