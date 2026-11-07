import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { useTema } from "../hooks/useTema";
import * as disciplinasService from "../services/disciplinas";
import Icone, { type NomeIcone } from "./Icone";

interface Disciplina {
  id: string;
  nome: string;
  cor: string;
}

const NAVEGACAO: { para: string; nome: string; icone: NomeIcone }[] = [
  { para: "/", nome: "Início", icone: "inicio" },
  { para: "/grade-horaria", nome: "Grade horária", icone: "grade" },
  { para: "/trabalhos", nome: "Trabalhos", icone: "trabalhos" },
  { para: "/provas", nome: "Provas", icone: "provas" },
  { para: "/disciplinas", nome: "Disciplinas", icone: "disciplinas" },
];

function Marca() {
  return (
    <Link to="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
      <span className="marca h-6 w-6" aria-hidden="true" />
      Faculdade
    </Link>
  );
}

export default function Sidebar() {
  const { usuario, logout } = useAuth();
  const { tema, alternarTema } = useTema();
  const location = useLocation();

  const [aberta, setAberta] = useState(false);
  const [cursando, setCursando] = useState<Disciplina[]>([]);
  const [ira, setIra] = useState<number | null>(null);

  // Recarrega a cada troca de página, para refletir disciplinas criadas ou concluídas
  useEffect(() => {
    async function carregar() {
      try {
        const [ativas, concluidas] = await Promise.all([
          disciplinasService.listar("cursando"),
          disciplinasService.listar("concluida"),
        ]);
        setCursando(ativas);

        const somaCargas = concluidas.reduce((acc, d) => acc + (d.cargaHoraria || 0), 0);
        const somaPonderada = concluidas.reduce(
          (acc, d) => acc + (d.notaFinal || 0) * (d.cargaHoraria || 0),
          0
        );
        setIra(somaCargas > 0 ? somaPonderada / somaCargas : null);
      } catch {
        // A sidebar continua utilizável mesmo se a lista não carregar
      }
    }

    carregar();
  }, [location.pathname]);

  useEffect(() => {
    function fecharComEsc(evento: KeyboardEvent) {
      if (evento.key === "Escape") setAberta(false);
    }
    document.addEventListener("keydown", fecharComEsc);
    return () => document.removeEventListener("keydown", fecharComEsc);
  }, []);

  const conteudo = (
    <div className="flex h-full flex-col">
      <div className="hidden h-14 items-center px-5 lg:flex">
        <Marca />
      </div>

      <nav className="flex flex-col gap-0.5 px-3 pt-2" aria-label="Principal">
        {NAVEGACAO.map((item) => (
          <NavLink
            key={item.para}
            to={item.para}
            end={item.para === "/"}
            className={({ isActive }) =>
              `flex h-9 items-center gap-3 rounded-controle px-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-realce font-medium text-grafite"
                  : "text-lapis hover:bg-realce/60 hover:text-grafite"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icone nome={item.icone} className={isActive ? "text-tinta" : ""} />
                {item.nome}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-8 min-h-0 flex-1 overflow-y-auto px-3">
        <p className="px-2.5 pb-2 text-xs font-medium text-lapis">Cursando</p>
        {cursando.length === 0 ? (
          <Link to="/disciplinas" className="block px-2.5 py-1.5 text-sm text-lapis hover:text-grafite">
            Adicione sua primeira disciplina
          </Link>
        ) : (
          <ul className="flex flex-col gap-0.5">
            {cursando.map((disciplina) => (
              <li key={disciplina.id}>
                <NavLink
                  to={`/disciplinas/${disciplina.id}`}
                  className={({ isActive }) =>
                    `flex h-8 items-center gap-3 rounded-controle px-2.5 text-sm transition-colors ${
                      isActive ? "bg-realce text-grafite" : "text-lapis hover:bg-realce/60 hover:text-grafite"
                    }`
                  }
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: disciplina.cor }}
                    aria-hidden="true"
                  />
                  <span className="truncate">{disciplina.nome}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-linha p-3">
        <div className="flex items-center gap-3 px-1.5 py-1">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-tinta/15 text-xs font-semibold text-tinta">
            {usuario?.nome?.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{usuario?.nome}</p>
            <p className="numeros text-xs text-lapis" title="Índice de rendimento acadêmico, ponderado pela carga horária">
              {ira !== null
                ? `IRA ${ira.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : "IRA aparece ao concluir uma disciplina"}
            </p>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-1">
          <button
            onClick={alternarTema}
            className="botao-icone"
            aria-label={tema === "escuro" ? "Usar tema claro" : "Usar tema escuro"}
            title={tema === "escuro" ? "Usar tema claro" : "Usar tema escuro"}
          >
            <Icone nome={tema === "escuro" ? "sol" : "lua"} />
          </button>
          <button onClick={logout} className="botao-icone ml-auto w-auto gap-2 px-2.5 text-sm hover:text-urgente">
            <Icone nome="sair" tamanho={16} />
            Sair
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Celular e tablet: barra no topo + gaveta */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-linha bg-papel/90 px-4 backdrop-blur lg:hidden">
        <Marca />
        <button
          onClick={() => setAberta(true)}
          className="botao-icone"
          aria-label="Abrir menu"
          aria-expanded={aberta}
        >
          <Icone nome="menu" tamanho={20} />
        </button>
      </header>

      {aberta && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            className="absolute inset-0 bg-grafite/30"
            onClick={() => setAberta(false)}
            aria-label="Fechar menu"
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-linha bg-papel">
            <div className="flex h-14 items-center justify-between px-5">
              <Marca />
              <button onClick={() => setAberta(false)} className="botao-icone" aria-label="Fechar menu">
                <Icone nome="fechar" />
              </button>
            </div>
            {/* Fecha a gaveta quando qualquer link dentro dela é clicado */}
            <div
              className="min-h-0 flex-1"
              onClick={(evento) => {
                if ((evento.target as HTMLElement).closest("a")) setAberta(false);
              }}
            >
              {conteudo}
            </div>
          </aside>
        </div>
      )}

      {/* Desktop: sidebar fixa */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-linha lg:block">
        {conteudo}
      </aside>
    </>
  );
}
