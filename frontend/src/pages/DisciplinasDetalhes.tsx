import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import * as disciplinasService from "../services/disciplinas";
import * as trabalhosService from "../services/trabalhos";
import * as provasService from "../services/provas";

interface Disciplina {
  id: string;
  nome: string;
  professor: string | null;
  cor: string;
  periodo: string | null;
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
    return <p className="p-6 text-gray-400">Carregando...</p>;
  }

  if (erro) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <p className="text-red-400 mb-4">{erro}</p>
        <Link to="/disciplinas" className="text-blue-400 hover:text-blue-300">
          Voltar para Disciplinas
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link
        to="/disciplinas"
        className="text-sm text-gray-400 hover:text-white mb-4 inline-block"
      >
        ← Voltar para Disciplinas
      </Link>

      <div
        className="bg-gray-800 border-l-4 rounded-lg p-5 mb-8"
        style={{ borderLeftColor: disciplina?.cor }}
      >
        <h1 className="text-xl font-semibold text-white">{disciplina?.nome}</h1>
        <p className="text-sm text-gray-400 mt-1">
          {disciplina?.professor || "Professor não informado"} —{" "}
          {disciplina?.periodo || "Período não informado"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-medium text-white">Trabalhos</h2>
            <Link
              to={`/disciplinas/${id}/trabalhos/novo`}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              + Novo trabalho
            </Link>
          </div>

          {trabalhos.length === 0 ? (
            <p className="text-sm text-gray-400">Nenhum trabalho cadastrado.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {trabalhos.map((trabalho) => (
                <div
                  key={trabalho.id}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">
                      {trabalho.titulo}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-md ${
                        trabalho.status === "pendente"
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-green-500/10 text-green-400"
                      }`}
                    >
                      {trabalho.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Entrega: {new Date(trabalho.dataEntrega).toLocaleDateString()}
                  </p>
                  {trabalho.status === "pendente" && (
                    <button
                      onClick={() => handleConcluir(trabalho.id)}
                      className="text-xs text-blue-400 hover:text-blue-300 mt-2"
                    >
                      Concluir
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-medium text-white">Provas</h2>
            <Link
              to={`/disciplinas/${id}/provas/novo`}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              + Nova prova
            </Link>
          </div>

          {provas.length === 0 ? (
            <p className="text-sm text-gray-400">Nenhuma prova cadastrada.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {provas.map((prova) => (
                <div
                  key={prova.id}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3"
                >
                  <span className="text-sm font-medium text-white">
                    {prova.nome}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    Data: {new Date(prova.data).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}