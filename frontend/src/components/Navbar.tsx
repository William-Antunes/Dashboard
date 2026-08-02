import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import * as disciplinasService from "../services/disciplinas";

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);
  const [menuPerfilAberto, setMenuPerfilAberto] = useState(false);
  const [ira, setIra] = useState<number | null>(null);
  const [carregandoIra, setCarregandoIra] = useState(false);
  const perfilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function fecharAoClicarFora(evento: MouseEvent) {
      if (perfilRef.current && !perfilRef.current.contains(evento.target as Node)) {
        setMenuPerfilAberto(false);
      }
    }

    document.addEventListener("mousedown", fecharAoClicarFora);
    return () => document.removeEventListener("mousedown", fecharAoClicarFora);
  }, []);

  async function abrirMenuPerfil() {
    const abrindo = !menuPerfilAberto;
    setMenuPerfilAberto(abrindo);

    if (abrindo) {
      setCarregandoIra(true);
      try {
        const concluidas = await disciplinasService.listar("concluida");
        const somaCargas = concluidas.reduce(
          (acc, d) => acc + (d.cargaHoraria || 0),
          0
        );
        const somaPonderada = concluidas.reduce(
          (acc, d) => acc + (d.notaFinal || 0) * (d.cargaHoraria || 0),
          0
        );
        setIra(somaCargas > 0 ? somaPonderada / somaCargas : null);
      } finally {
        setCarregandoIra(false);
      }
    }
  }

  return (
    <nav className="relative bg-gray-900 border-b border-gray-800">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
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

          <div className="relative" ref={perfilRef}>
            <button
              onClick={abrirMenuPerfil}
              className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-semibold hover:bg-blue-500/30 transition-colors"
            >
              {usuario?.nome?.charAt(0).toUpperCase()}
            </button>

            {menuPerfilAberto && (
              <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4 z-10">
                <p className="text-sm font-medium text-white">{usuario?.nome}</p>
                <p className="text-xs text-gray-400 mt-0.5">{usuario?.email}</p>

                <div className="border-t border-gray-700 mt-3 pt-3">
                  <p className="text-xs text-gray-400 mb-1">IRA</p>
                  {carregandoIra ? (
                    <p className="text-sm text-gray-400">Calculando...</p>
                  ) : ira !== null ? (
                    <p className="text-lg font-semibold text-white">{ira.toFixed(2)}</p>
                  ) : (
                    <p className="text-sm text-gray-500">Sem dados suficientes</p>
                  )}
                </div>
              </div>
            )}
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
        <div className="sm:hidden absolute top-full left-0 right-0 z-20 flex flex-col gap-1 px-4 py-3 bg-gray-900 border-b border-gray-800 shadow-lg">
          <Link
            to="/disciplinas"
            onClick={() => setMenuAberto(false)}
            className="text-sm text-gray-300 py-2.5 px-2 rounded hover:bg-gray-800 active:bg-gray-800"
          >
            Disciplinas
          </Link>
          <Link
            to="/trabalhos"
            onClick={() => setMenuAberto(false)}
            className="text-sm text-gray-300 py-2.5 px-2 rounded hover:bg-gray-800 active:bg-gray-800"
          >
            Trabalhos
          </Link>
          <Link
            to="/provas"
            onClick={() => setMenuAberto(false)}
            className="text-sm text-gray-300 py-2.5 px-2 rounded hover:bg-gray-800 active:bg-gray-800"
          >
            Provas
          </Link>
          <Link
            to="/grade-horaria"
            onClick={() => setMenuAberto(false)}
            className="text-sm text-gray-300 py-2.5 px-2 rounded hover:bg-gray-800 active:bg-gray-800"
          >
            Grade Horária
          </Link>
          <div className="border-t border-gray-800 mt-2 pt-3 px-2 flex items-center justify-between">
            <span className="text-sm text-gray-400 truncate">Olá, {usuario?.nome}</span>
            <button onClick={logout} className="text-sm text-red-400 shrink-0 ml-3">
              Sair
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
