import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
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

function saudacaoPorHorario(): string {
  const hora = new Date().getHours();
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

function diasRestantes(dataTexto: string): number {
  const agora = new Date();
  const data = new Date(dataTexto);
  const diferencaEmMs = data.getTime() - agora.getTime();
  return Math.ceil(diferencaEmMs / (1000 * 60 * 60 * 24));
}

export default function Home() {
  const { usuario } = useAuth();

  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [trabalhos, setTrabalhos] = useState<Trabalho[]>([]);
  const [provas, setProvas] = useState<Prova[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarTudo() {
      try {
        const [dadosDisciplinas, dadosTrabalhos, dadosProvas] = await Promise.all([
          disciplinasService.listar(),
          trabalhosService.listar(),
          provasService.listar(),
        ]);

        setDisciplinas(dadosDisciplinas);
        setTrabalhos(dadosTrabalhos);
        setProvas(dadosProvas);
      } finally {
        setCarregando(false);
      }
    }

    carregarTudo();
  }, []);

  const trabalhosPendentes = trabalhos
    .filter((trabalho) => trabalho.status === "pendente")
    .sort(
      (a, b) =>
        new Date(a.dataEntrega).getTime() - new Date(b.dataEntrega).getTime()
    );

  const provasOrdenadas = [...provas].sort(
    (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
  );

  const proximaProvaDias =
    provasOrdenadas.length > 0 ? diasRestantes(provasOrdenadas[0].data) : null;

  function contarPendenciasDaDisciplina(disciplinaId: string): number {
    return trabalhos.filter(
      (trabalho) =>
        trabalho.disciplinaId === disciplinaId && trabalho.status === "pendente"
    ).length;
  }

  if (carregando) {
    return <p className="p-6 text-gray-400">Carregando...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold text-white mb-1">
        {saudacaoPorHorario()}, {usuario?.nome}
      </h1>
      <p className="text-gray-400 mb-6">Aqui está o resumo da sua semana</p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Trabalhos pendentes</p>
          <p className="text-2xl font-semibold text-white">
            {trabalhosPendentes.length}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Próxima prova</p>
          <p className="text-2xl font-semibold text-white">
            {proximaProvaDias !== null ? `${proximaProvaDias} dias` : "—"}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Disciplinas</p>
          <p className="text-2xl font-semibold text-white">
            {disciplinas.length}
          </p>
        </div>
      </div>

      <h2 className="text-base font-medium text-white mb-3">
        Trabalhos pendentes
      </h2>

      {trabalhosPendentes.length === 0 ? (
        <p className="text-sm text-gray-400 mb-8">
          Nenhum trabalho pendente. Você está em dia!
        </p>
      ) : (
        <div className="flex flex-col gap-2 mb-8">
          {trabalhosPendentes.map((trabalho) => {
            const dias = diasRestantes(trabalho.dataEntrega);
            const urgente = dias <= 3;

            return (
              <div
                key={trabalho.id}
                className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-lg px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      urgente ? "bg-red-500" : "bg-amber-500"
                    }`}
                  />
                  <span className="text-sm font-medium text-white">
                    {trabalho.titulo}
                  </span>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-md ${
                    urgente
                      ? "bg-red-500/10 text-red-400"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  {dias} dia{dias !== 1 ? "s" : ""}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <h2 className="text-base font-medium text-white mb-3">Disciplinas</h2>

      {disciplinas.length === 0 ? (
        <p className="text-sm text-gray-400">
          Você ainda não tem disciplinas cadastradas.{" "}
          <Link to="/disciplinas" className="text-blue-400 hover:text-blue-300">
            Adicionar a primeira
          </Link>
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {disciplinas.map((disciplina) => {
            const pendencias = contarPendenciasDaDisciplina(disciplina.id);

            return (
              <Link
                key={disciplina.id}
                to={`/disciplinas/${disciplina.id}`}
                className="bg-gray-800 border-l-4 rounded-lg p-4 hover:bg-gray-750 transition-colors"
                style={{ borderLeftColor: disciplina.cor }}
              >
                <p className="font-medium text-white">{disciplina.nome}</p>
                <p className="text-sm text-gray-400 mt-1">
                  {disciplina.professor || "Professor não informado"}
                </p>
                <p
                  className={`text-sm mt-2 ${
                    pendencias > 0 ? "text-blue-400" : "text-gray-500"
                  }`}
                >
                  {pendencias > 0 ? `${pendencias} pendência(s)` : "Em dia"}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}