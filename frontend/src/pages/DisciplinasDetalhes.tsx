import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import * as disciplinasService from "../services/disciplinas";
import * as trabalhosService from "../services/trabalhos";
import * as provasService from "../services/provas";
import Icone from "../components/Icone";
import MedidorFaltas from "../components/MedidorFaltas";
import { descreverPrazo, diasAte, formatarData } from "../utils/datas";
import { fundoDaCor, resumirHorario } from "../utils/disciplinas";

interface Horario {
  diaSemana: number;
  turno: string;
  slotInicio: number;
  slotFim: number;
}

interface Disciplina {
  id: string;
  nome: string;
  professor: string | null;
  cor: string;
  periodo: string | null;
  status: string;
  cargaHoraria: number | null;
  faltas: number;
  horarios: Horario[];
}

interface Trabalho {
  id: string;
  titulo: string;
  descricao: string | null;
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

export default function DisciplinaDetalhes() {
  const { id } = useParams<{ id: string }>();

  const [disciplina, setDisciplina] = useState<Disciplina | null>(null);
  const [trabalhos, setTrabalhos] = useState<Trabalho[]>([]);
  const [provas, setProvas] = useState<Prova[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarDados();
  }, [id]);

  async function carregarDados() {
    if (!id) return;

    setCarregando(true);
    setErro("");

    try {
      const [todasDisciplinas, dadosTrabalhos, dadosProvas] = await Promise.all([
        disciplinasService.listar(),
        trabalhosService.listar(id),
        provasService.listar(id),
      ]);

      const disciplinaEncontrada = todasDisciplinas.find((d) => d.id === id);

      if (!disciplinaEncontrada) {
        setErro("Disciplina não encontrada");
        return;
      }

      setDisciplina(disciplinaEncontrada);
      setTrabalhos(dadosTrabalhos);
      setProvas(dadosProvas);
    } catch {
      setErro("Não foi possível carregar os dados da disciplina");
    } finally {
      setCarregando(false);
    }
  }

  async function handleConcluir(trabalhoId: string) {
    try {
      await trabalhosService.concluir(trabalhoId);
      carregarDados();
    } catch {
      setErro("Não foi possível concluir o trabalho");
    }
  }

  if (carregando) {
    return <p className="text-sm text-lapis">Carregando...</p>;
  }

  if (erro || !disciplina) {
    return (
      <div>
        <p className="erro mb-4">{erro}</p>
        <Link to="/disciplinas" className="link text-sm">
          Voltar para disciplinas
        </Link>
      </div>
    );
  }

  const trabalhosOrdenados = [...trabalhos].sort((a, b) => {
    if (a.status !== b.status) return a.status === "pendente" ? -1 : 1;
    return a.dataEntrega.localeCompare(b.dataEntrega);
  });

  const provasOrdenadas = [...provas].sort((a, b) => a.data.localeCompare(b.data));

  return (
    <div>
      <Link
        to="/disciplinas"
        className="botao-texto mb-6 inline-flex items-center gap-1.5"
      >
        <Icone nome="voltar" tamanho={16} />
        Disciplinas
      </Link>

      <header
        className="mb-10 border-l-4 pl-5"
        style={{ borderLeftColor: disciplina.cor }}
      >
        <h1 className="titulo-pagina">{disciplina.nome}</h1>
        <p className="mt-1 text-lapis">
          {disciplina.professor || "Professor não informado"}
          {disciplina.periodo ? `, período ${disciplina.periodo}` : ""}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
          {disciplina.status === "cursando" && disciplina.cargaHoraria ? (
            <MedidorFaltas faltas={disciplina.faltas} cargaHoraria={disciplina.cargaHoraria} largura="w-32" />
          ) : null}
          {disciplina.horarios.length > 0 && (
            <p className="text-xs text-lapis">
              {disciplina.horarios.map(resumirHorario).join("  /  ")}
            </p>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-6">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="titulo-secao">Trabalhos</h2>
            <Link
              to={`/disciplinas/${id}/trabalhos/novo`}
              className="botao botao-secundario h-8 px-2.5"
            >
              <Icone nome="mais" tamanho={14} />
              Novo trabalho
            </Link>
          </div>

          {trabalhosOrdenados.length === 0 ? (
            <p className="text-sm text-lapis">Nenhum trabalho cadastrado nesta disciplina.</p>
          ) : (
            <ul className="painel lista">
              {trabalhosOrdenados.map((trabalho) => {
                const pendente = trabalho.status === "pendente";
                const dias = diasAte(trabalho.dataEntrega);

                return (
                  <li key={trabalho.id} className="flex items-start gap-3 px-4 py-3">
                    <button
                      onClick={() => pendente && handleConcluir(trabalho.id)}
                      disabled={!pendente}
                      className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border transition-colors ${
                        pendente
                          ? "border-lapis/60 hover:border-tinta hover:bg-tinta/10"
                          : "border-transparent bg-lapis/30 text-folha"
                      }`}
                      aria-label={pendente ? `Concluir ${trabalho.titulo}` : `${trabalho.titulo} concluído`}
                      title={pendente ? "Marcar como concluído" : "Concluído"}
                    >
                      {!pendente && <Icone nome="check" tamanho={12} className="text-grafite" />}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-medium ${pendente ? "" : "text-lapis line-through"}`}>
                        {trabalho.titulo}
                      </p>
                      {trabalho.descricao && (
                        <p className="mt-0.5 text-xs text-lapis">{trabalho.descricao}</p>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      {pendente && (
                        <p className={`numeros text-xs ${dias <= 3 ? "font-medium text-urgente" : "text-grafite"}`}>
                          {descreverPrazo(dias)}
                        </p>
                      )}
                      <p className="numeros text-xs text-lapis">{formatarData(trabalho.dataEntrega)}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="titulo-secao">Provas</h2>
            <Link
              to={`/disciplinas/${id}/provas/novo`}
              className="botao botao-secundario h-8 px-2.5"
            >
              <Icone nome="mais" tamanho={14} />
              Nova prova
            </Link>
          </div>

          {provasOrdenadas.length === 0 ? (
            <p className="text-sm text-lapis">Nenhuma prova cadastrada nesta disciplina.</p>
          ) : (
            <ul className="painel lista">
              {provasOrdenadas.map((prova) => {
                const dias = diasAte(prova.data);
                const realizada = dias < 0;

                return (
                  <li key={prova.id} className={`flex items-center gap-3 px-4 py-3 ${realizada ? "text-lapis" : ""}`}>
                    <span
                      className="condensado numeros flex h-10 w-10 shrink-0 items-center justify-center rounded-controle text-lg font-semibold"
                      style={realizada ? undefined : { backgroundColor: fundoDaCor(disciplina.cor, 18) }}
                    >
                      {Number(prova.data.slice(8, 10))}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{prova.nome}</p>
                      <p className="numeros text-xs text-lapis">{formatarData(prova.data)}</p>
                    </div>
                    <p className={`numeros shrink-0 text-xs ${!realizada && dias <= 3 ? "font-medium text-urgente" : "text-lapis"}`}>
                      {realizada ? "realizada" : descreverPrazo(dias)}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
