import { useState, useEffect, type FormEvent } from "react";
import { Link } from "react-router-dom";
import * as disciplinasService from "../services/disciplinas";

interface Disciplina {
  id: string;
  nome: string;
  professor: string | null;
  cor: string;
  periodo: string | null;
  usuarioId: string;
}

export default function Disciplinas() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [nome, setNome] = useState("");
  const [professor, setProfessor] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [disciplinaEditando, setDisciplinaEditando] = useState<Disciplina | null>(
    null
  );

  useEffect(() => {
    carregarDisciplinas();
  }, []);

  async function carregarDisciplinas() {
    try {
      const dados = await disciplinasService.listar();
      setDisciplinas(dados);
    } catch {
      setErro("Não foi possível carregar as disciplinas");
    } finally {
      setCarregando(false);
    }
  }

  function iniciarEdicao(disciplina: Disciplina) {
    setDisciplinaEditando(disciplina);
    setNome(disciplina.nome);
    setProfessor(disciplina.professor || "");
    setPeriodo(disciplina.periodo || "");
  }

  function cancelarEdicao() {
    setDisciplinaEditando(null);
    setNome("");
    setProfessor("");
    setPeriodo("");
  }

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setErro("");

    try {
      if (disciplinaEditando) {
        await disciplinasService.editar(disciplinaEditando.id, {
          nome,
          professor,
          periodo,
        });
      } else {
        await disciplinasService.criar({ nome, professor, periodo });
      }

      cancelarEdicao();
      carregarDisciplinas();
    } catch {
      setErro(
        disciplinaEditando
          ? "Não foi possível editar a disciplina"
          : "Não foi possível criar a disciplina"
      );
    }
  }

  async function handleExcluir(id: string) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir essa disciplina? Todos os trabalhos e provas dela também serão excluídos."
    );

    if (!confirmar) return;

    try {
      await disciplinasService.excluir(id);
      carregarDisciplinas();
    } catch {
      setErro("Não foi possível excluir a disciplina");
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-semibold text-white mb-6">Disciplinas</h1>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
        <h2 className="text-base font-medium text-white mb-4">
          {disciplinaEditando ? "Editar disciplina" : "Nova disciplina"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(evento) => setNome(evento.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Professor</label>
            <input
              type="text"
              value={professor}
              onChange={(evento) => setProfessor(evento.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Período</label>
            <input
              type="text"
              value={periodo}
              onChange={(evento) => setPeriodo(evento.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {erro && (
            <p className="col-span-1 sm:col-span-3 text-sm text-red-400">{erro}</p>
          )}

          <div className="col-span-1 sm:col-span-3 flex gap-3">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg transition-colors"
            >
              {disciplinaEditando ? "Salvar alterações" : "Adicionar disciplina"}
            </button>

            {disciplinaEditando && (
              <button
                type="button"
                onClick={cancelarEdicao}
                className="text-gray-400 hover:text-white px-4 py-2"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {carregando ? (
        <p className="text-gray-400">Carregando...</p>
      ) : disciplinas.length === 0 ? (
        <p className="text-gray-400">Nenhuma disciplina cadastrada ainda.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {disciplinas.map((disciplina) => (
            <div
              key={disciplina.id}
              className="bg-gray-800 border-l-4 rounded-lg p-4"
              style={{ borderLeftColor: disciplina.cor }}
            >
              <Link
                to={`/disciplinas/${disciplina.id}`}
                className="font-medium text-white hover:text-blue-400"
              >
                {disciplina.nome}
              </Link>
              <p className="text-sm text-gray-400 mt-1">
                {disciplina.professor || "Professor não informado"} —{" "}
                {disciplina.periodo || "Período não informado"}
              </p>

              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => iniciarEdicao(disciplina)}
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleExcluir(disciplina.id)}
                  className="text-sm text-gray-400 hover:text-red-400"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}