import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import * as disciplinasService from "../services/disciplinas";
import * as trabalhosService from "../services/trabalhos";
import * as provasService from "../services/provas";
import FaixaSemana, { type EventoDaSemana } from "../components/FaixaSemana";
import MedidorFaltas from "../components/MedidorFaltas";
import { descreverPrazo, diasAte, formatarData } from "../utils/datas";

interface Disciplina {
  id: string;
  nome: string;
  professor: string | null;
  cor: string;
  periodo: string | null;
  cargaHoraria: number | null;
  faltas: number;
}

interface Trabalho {
  id: string;
  titulo: string;
  dataEntrega: string;
  status: string;
  disciplinaId: string;
}

interface Prova {
  id: string;
  nome: string;
  data: string;
  disciplinaId: string;
}

const LIMITE_A_SEGUIR = 8;

function saudacaoPorHorario(): string {
  const hora = new Date().getHours();
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

export default function Home() {
  const { usuario } = useAuth();

  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [trabalhos, setTrabalhos] = useState<Trabalho[]>([]);
  const [provas, setProvas] = useState<Prova[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarTudo() {
      try {
        const [dadosDisciplinas, dadosTrabalhos, dadosProvas] = await Promise.all([
          disciplinasService.listar("cursando"),
          trabalhosService.listar(),
          provasService.listar(),
        ]);

        setDisciplinas(dadosDisciplinas);
        setTrabalhos(dadosTrabalhos);
        setProvas(dadosProvas);
      } catch {
        setErro("Não foi possível carregar seus dados. Confira se o servidor está rodando e recarregue a página.");
      } finally {
        setCarregando(false);
      }
    }

    carregarTudo();
  }, []);

  function disciplinaDe(id: string) {
    return disciplinas.find((disciplina) => disciplina.id === id);
  }

  const trabalhosPendentes = trabalhos.filter((trabalho) => trabalho.status === "pendente");

  const eventos: EventoDaSemana[] = [
    ...trabalhosPendentes.map((trabalho) => ({
      id: trabalho.id,
      tipo: "trabalho" as const,
      titulo: trabalho.titulo,
      data: trabalho.dataEntrega,
      disciplina: disciplinaDe(trabalho.disciplinaId),
    })),
    ...provas.map((prova) => ({
      id: prova.id,
      tipo: "prova" as const,
      titulo: prova.nome,
      data: prova.data,
      disciplina: disciplinaDe(prova.disciplinaId),
    })),
  ];

  // Trabalhos pendentes (inclusive atrasados) e provas que ainda não aconteceram
  const aSeguir = eventos
    .filter((evento) => evento.tipo === "trabalho" || diasAte(evento.data) >= 0)
    .sort((a, b) => a.data.localeCompare(b.data));

  function contarPendencias(disciplinaId: string): number {
    return trabalhosPendentes.filter((trabalho) => trabalho.disciplinaId === disciplinaId).length;
  }

  const dataDeHoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  if (carregando) {
    return <p className="text-sm text-lapis">Carregando...</p>;
  }

  return (
    <div className="flex flex-col gap-12">
      <header>
        <h1 className="titulo-pagina">
          {saudacaoPorHorario()}, {usuario?.nome?.split(" ")[0]}
        </h1>
        <p className="mt-1 text-lapis first-letter:uppercase">{dataDeHoje}</p>
        {erro && <p className="erro mt-4">{erro}</p>}
      </header>

      <FaixaSemana eventos={eventos} />

      <section>
        <div className="mb-3 flex items-baseline justify-between gap-4">
          <h2 className="titulo-secao">A seguir</h2>
          {aSeguir.length > LIMITE_A_SEGUIR && (
            <Link to="/trabalhos" className="botao-texto">
              Ver todos os trabalhos
            </Link>
          )}
        </div>

        {aSeguir.length === 0 ? (
          <p className="text-sm text-lapis">
            Nenhum trabalho ou prova pela frente. Cadastre na página da{" "}
            <Link to="/disciplinas" className="link">
              disciplina
            </Link>{" "}
            e ele aparece aqui.
          </p>
        ) : (
          <ul className="painel lista">
            {aSeguir.slice(0, LIMITE_A_SEGUIR).map((evento) => {
              const dias = diasAte(evento.data);
              const urgente = dias <= 3;

              return (
                <li key={`${evento.tipo}-${evento.id}`} className="flex items-center gap-3 px-4 py-3">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: evento.disciplina?.cor ?? "rgb(var(--lapis))" }}
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{evento.titulo}</p>
                    <p className="truncate text-xs text-lapis">
                      {evento.tipo === "prova" ? "Prova" : "Trabalho"}
                      {evento.disciplina ? ` de ${evento.disciplina.nome}` : ""}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className={`numeros text-sm ${urgente ? "font-medium text-urgente" : "text-grafite"}`}>
                      {descreverPrazo(dias)}
                    </p>
                    <p className="numeros text-xs text-lapis">{formatarData(evento.data)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-baseline justify-between gap-4">
          <h2 className="titulo-secao">Disciplinas</h2>
          <Link to="/disciplinas" className="botao-texto">
            Gerenciar
          </Link>
        </div>

        {disciplinas.length === 0 ? (
          <p className="text-sm text-lapis">
            Você ainda não tem disciplinas em andamento.{" "}
            <Link to="/disciplinas" className="link">
              Adicionar a primeira
            </Link>
          </p>
        ) : (
          <ul className="painel lista">
            {disciplinas.map((disciplina) => {
              const pendencias = contarPendencias(disciplina.id);

              return (
                <li key={disciplina.id}>
                  <Link
                    to={`/disciplinas/${disciplina.id}`}
                    className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 transition-colors hover:bg-realce/60"
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: disciplina.cor }}
                      aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1 basis-40">
                      <p className="truncate text-sm font-medium">{disciplina.nome}</p>
                      <p className="truncate text-xs text-lapis">
                        {disciplina.professor || "Professor não informado"}
                      </p>
                    </div>
                    {disciplina.cargaHoraria ? (
                      <MedidorFaltas faltas={disciplina.faltas} cargaHoraria={disciplina.cargaHoraria} />
                    ) : null}
                    <p className="numeros text-xs text-lapis sm:w-28 sm:text-right">
                      {pendencias === 0
                        ? "Em dia"
                        : `${pendencias} ${pendencias === 1 ? "trabalho pendente" : "trabalhos pendentes"}`}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
