import { useState, useEffect, type FormEvent } from "react";
import * as disciplinasService from "../services/disciplinas";
import * as trabalhosService from "../services/trabalhos";

interface Disciplina {
  id: string;
  nome: string;
}

interface Trabalho {
  id: string;
  titulo: string;
  descricao: string | null;
  dataEntrega: string;
  status: string;
  disciplinaId: string;
}

export default function Trabalhos() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [trabalhos, setTrabalhos] = useState<Trabalho[]>([]);
  const [filtroDisciplinaId, setFiltroDisciplinaId] = useState("");
  const [carregando, setCarregando] = useState(true);

  const [disciplinaId, setDisciplinaId] = useState("");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataEntrega, setDataEntrega] = useState("");
  const [erro, setErro] = useState("");
  const [trabalhoEditando, setTrabalhoEditando] = useState<Trabalho | null>(
    null
  );

  useEffect(() => {
    disciplinasService.listar().then(setDisciplinas);
  }, []);

  useEffect(() => {
    carregarTrabalhos();
  }, [filtroDisciplinaId]);

  async function carregarTrabalhos() {
    setCarregando(true);
    try {
      const dados = await trabalhosService.listar(
        filtroDisciplinaId || undefined
      );
      setTrabalhos(dados);
    } finally {
      setCarregando(false);
    }
  }

  function nomeDaDisciplina(id: string): string {
    const disciplina = disciplinas.find((d) => d.id === id);
    return disciplina ? disciplina.nome : "—";
  }

  function iniciarEdicao(trabalho: Trabalho) {
    setTrabalhoEditando(trabalho);
    setDisciplinaId(trabalho.disciplinaId);
    setTitulo(trabalho.titulo);
    setDescricao(trabalho.descricao || "");
    setDataEntrega(trabalho.dataEntrega.slice(0, 10));
  }

  function cancelarEdicao() {
    setTrabalhoEditando(null);
    setDisciplinaId("");
    setTitulo("");
    setDescricao("");
    setDataEntrega("");
  }

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setErro("");

    if (!disciplinaId) {
      setErro("Selecione uma disciplina");
      return;
    }

    try {
      if (trabalhoEditando) {
        await trabalhosService.editar(trabalhoEditando.id, {
          disciplinaId,
          titulo,
          descricao,
          dataEntrega,
        });
      } else {
        await trabalhosService.criar({
          disciplinaId,
          titulo,
          descricao,
          dataEntrega,
        });
      }

      cancelarEdicao();
      carregarTrabalhos();
    } catch {
      setErro(
        trabalhoEditando
          ? "Não foi possível editar o trabalho"
          : "Não foi possível criar o trabalho"
      );
    }
  }

  async function handleConcluir(trabalhoId: string) {
    try {
      await trabalhosService.concluir(trabalhoId);
      carregarTrabalhos();
    } catch {
      setErro("Não foi possível concluir o trabalho");
    }
  }

  async function handleExcluir(id: string) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir esse trabalho?"
    );

    if (!confirmar) return;

    try {
      await trabalhosService.excluir(id);
      carregarTrabalhos();
    } catch {
      setErro("Não foi possível excluir o trabalho");
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold text-white mb-6">Trabalhos</h1>

      <div className="mb-6">
        <label className="block text-sm text-gray-300 mb-1">
          Filtrar por disciplina
        </label>
        <select
          value={filtroDisciplinaId}
          onChange={(evento) => setFiltroDisciplinaId(evento.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
        >
          <option value="">Todas as disciplinas</option>
          {disciplinas.map((disciplina) => (
            <option key={disciplina.id} value={disciplina.id}>
              {disciplina.nome}
            </option>
          ))}
        </select>
      </div>

      {carregando ? (
        <p className="text-gray-400 mb-8">Carregando...</p>
      ) : trabalhos.length === 0 ? (
        <p className="text-gray-400 mb-8">Nenhum trabalho cadastrado.</p>
      ) : (
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-left text-gray-400">
                <th className="px-4 py-3 font-medium">Título</th>
                <th className="px-4 py-3 font-medium">Disciplina</th>
                <th className="px-4 py-3 font-medium">Entrega</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {trabalhos.map((trabalho) => (
                <tr
                  key={trabalho.id}
                  className="border-b border-gray-700 last:border-0"
                >
                  <td className="px-4 py-3 text-white">{trabalho.titulo}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {nomeDaDisciplina(trabalho.disciplinaId)}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(trabalho.dataEntrega).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-md ${
                        trabalho.status === "pendente"
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-green-500/10 text-green-400"
                      }`}
                    >
                      {trabalho.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      {trabalho.status === "pendente" && (
                        <button
                          onClick={() => handleConcluir(trabalho.id)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          Concluir
                        </button>
                      )}
                      <button
                        onClick={() => iniciarEdicao(trabalho)}
                        className="text-gray-400 hover:text-white"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleExcluir(trabalho.id)}
                        className="text-gray-400 hover:text-red-400"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h2 className="text-base font-medium text-white mb-4">
          {trabalhoEditando ? "Editar trabalho" : "Novo trabalho"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Disciplina
            </label>
            <select
              value={disciplinaId}
              onChange={(evento) => setDisciplinaId(evento.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">Selecione uma disciplina</option>
              {disciplinas.map((disciplina) => (
                <option key={disciplina.id} value={disciplina.id}>
                  {disciplina.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(evento) => setTitulo(evento.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Descrição
            </label>
            <input
              type="text"
              value={descricao}
              onChange={(evento) => setDescricao(evento.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Data de entrega
            </label>
            <input
              type="date"
              value={dataEntrega}
              onChange={(evento) => setDataEntrega(evento.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {erro && <p className="col-span-2 text-sm text-red-400">{erro}</p>}

          <div className="col-span-2 flex gap-3">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg transition-colors"
            >
              {trabalhoEditando ? "Salvar alterações" : "Criar trabalho"}
            </button>

            {trabalhoEditando && (
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
    </div>
  );
}