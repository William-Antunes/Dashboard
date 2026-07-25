import { useState, useEffect, FormEvent } from "react";
import * as disciplinasService from "../services/disciplinas";
import * as provasService from "../services/provas";

interface Disciplina {
  id: string;
  nome: string;
}

interface Prova {
  id: string;
  nome: string;
  data: string;
  disciplinaId: string;
}

export default function Provas() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [provas, setProvas] = useState<Prova[]>([]);
  const [filtroDisciplinaId, setFiltroDisciplinaId] = useState("");
  const [carregando, setCarregando] = useState(true);

  const [disciplinaId, setDisciplinaId] = useState("");
  const [nome, setNome] = useState("");
  const [data, setData] = useState("");
  const [erro, setErro] = useState("");
  const [provaEditando, setProvaEditando] = useState<Prova | null>(null);

  useEffect(() => {
    disciplinasService.listar().then(setDisciplinas);
  }, []);

  useEffect(() => {
    carregarProvas();
  }, [filtroDisciplinaId]);

  async function carregarProvas() {
    setCarregando(true);
    try {
      const dados = await provasService.listar(filtroDisciplinaId || undefined);
      setProvas(dados);
    } finally {
      setCarregando(false);
    }
  }

  function nomeDaDisciplina(id: string): string {
    const disciplina = disciplinas.find((d) => d.id === id);
    return disciplina ? disciplina.nome : "—";
  }

  function iniciarEdicao(prova: Prova) {
    setProvaEditando(prova);
    setDisciplinaId(prova.disciplinaId);
    setNome(prova.nome);
    setData(prova.data.slice(0, 10));
  }

  function cancelarEdicao() {
    setProvaEditando(null);
    setDisciplinaId("");
    setNome("");
    setData("");
  }

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setErro("");

    if (!disciplinaId) {
      setErro("Selecione uma disciplina");
      return;
    }

    try {
      if (provaEditando) {
        await provasService.editar(provaEditando.id, {
          disciplinaId,
          nome,
          data,
        });
      } else {
        await provasService.criar({ disciplinaId, nome, data });
      }

      cancelarEdicao();
      carregarProvas();
    } catch {
      setErro(
        provaEditando
          ? "Não foi possível editar a prova"
          : "Não foi possível criar a prova"
      );
    }
  }

  async function handleExcluir(id: string) {
    const confirmar = window.confirm("Tem certeza que deseja excluir essa prova?");

    if (!confirmar) return;

    try {
      await provasService.excluir(id);
      carregarProvas();
    } catch {
      setErro("Não foi possível excluir a prova");
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold text-white mb-6">Provas</h1>

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
      ) : provas.length === 0 ? (
        <p className="text-gray-400 mb-8">Nenhuma prova cadastrada.</p>
      ) : (
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-left text-gray-400">
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Disciplina</th>
                <th className="px-4 py-3 font-medium">Data</th>
                <th className="px-4 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {provas.map((prova) => (
                <tr
                  key={prova.id}
                  className="border-b border-gray-700 last:border-0"
                >
                  <td className="px-4 py-3 text-white">{prova.nome}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {nomeDaDisciplina(prova.disciplinaId)}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(prova.data).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => iniciarEdicao(prova)}
                        className="text-gray-400 hover:text-white"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleExcluir(prova.id)}
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
          {provaEditando ? "Editar prova" : "Nova prova"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
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
            <label className="block text-sm text-gray-300 mb-1">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(evento) => setNome(evento.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Data</label>
            <input
              type="date"
              value={data}
              onChange={(evento) => setData(evento.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {erro && <p className="col-span-3 text-sm text-red-400">{erro}</p>}

          <div className="col-span-3 flex gap-3">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg transition-colors"
            >
              {provaEditando ? "Salvar alterações" : "Criar prova"}
            </button>

            {provaEditando && (
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