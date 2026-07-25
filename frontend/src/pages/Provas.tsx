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
    <div>
      <h1>Provas</h1>

      <div>
        <label>Filtrar por disciplina</label>
        <select
          value={filtroDisciplinaId}
          onChange={(evento) => setFiltroDisciplinaId(evento.target.value)}
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
        <p>Carregando...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Disciplina</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {provas.map((prova) => (
              <tr key={prova.id}>
                <td>{prova.nome}</td>
                <td>{nomeDaDisciplina(prova.disciplinaId)}</td>
                <td>{new Date(prova.data).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => iniciarEdicao(prova)}>Editar</button>
                  <button onClick={() => handleExcluir(prova.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>{provaEditando ? "Editar prova" : "Nova prova"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Disciplina</label>
          <select
            value={disciplinaId}
            onChange={(evento) => setDisciplinaId(evento.target.value)}
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
          <label>Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(evento) => setNome(evento.target.value)}
          />
        </div>

        <div>
          <label>Data</label>
          <input
            type="date"
            value={data}
            onChange={(evento) => setData(evento.target.value)}
          />
        </div>

        {erro && <p>{erro}</p>}

        <button type="submit">
          {provaEditando ? "Salvar alterações" : "Criar prova"}
        </button>

        {provaEditando && (
          <button type="button" onClick={cancelarEdicao}>
            Cancelar
          </button>
        )}
      </form>
    </div>
  );
}