import { useState, useEffect, type FormEvent } from "react";
import * as disciplinasService from "../services/disciplinas";
import * as provasService from "../services/provas";
import Icone from "../components/Icone";
import { dataLocal, descreverPrazo, diasAte, mesCurto } from "../utils/datas";
import { fundoDaCor } from "../utils/disciplinas";

interface Disciplina {
  id: string;
  nome: string;
  cor: string;
  status: string;
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

  const [formAberto, setFormAberto] = useState(false);
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

  function disciplinaDe(id: string) {
    return disciplinas.find((d) => d.id === id);
  }

  const disciplinasDisponiveis = disciplinas.filter(
    (disciplina) => disciplina.status !== "concluida"
  );

  const proximas = provas
    .filter((prova) => diasAte(prova.data) >= 0)
    .sort((a, b) => a.data.localeCompare(b.data));

  const realizadas = provas
    .filter((prova) => diasAte(prova.data) < 0)
    .sort((a, b) => b.data.localeCompare(a.data));

  function abrirNovaProva() {
    cancelarEdicao();
    setDisciplinaId(filtroDisciplinaId);
    setFormAberto(true);
  }

  function iniciarEdicao(prova: Prova) {
    setProvaEditando(prova);
    setDisciplinaId(prova.disciplinaId);
    setNome(prova.nome);
    setData(prova.data.slice(0, 10));
    setFormAberto(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelarEdicao() {
    setProvaEditando(null);
    setDisciplinaId("");
    setNome("");
    setData("");
    setErro("");
    setFormAberto(false);
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
          ? "Não foi possível salvar as alterações. Confira o nome e a data."
          : "Não foi possível criar a prova. Confira o nome e a data."
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

  function renderLinha(prova: Prova) {
    const disciplina = disciplinaDe(prova.disciplinaId);
    const dias = diasAte(prova.data);
    const realizada = dias < 0;
    const dataDaProva = dataLocal(prova.data);

    return (
      <li key={prova.id} className="flex items-center gap-4 px-4 py-3">
        <div
          className={`flex w-12 shrink-0 flex-col items-center rounded-controle py-1.5 ${realizada ? "bg-realce text-lapis" : ""}`}
          style={realizada || !disciplina ? undefined : { backgroundColor: fundoDaCor(disciplina.cor, 18) }}
        >
          <span className="condensado numeros text-[22px] font-semibold leading-none">
            {dataDaProva.getDate()}
          </span>
          <span className="mt-0.5 text-[11px] text-lapis">{mesCurto(dataDaProva)}</span>
        </div>

        <div className="min-w-0 flex-1">
          <p className={`truncate text-sm font-medium ${realizada ? "text-lapis" : ""}`}>{prova.nome}</p>
          <p className="truncate text-xs text-lapis">{disciplina?.nome ?? "Disciplina removida"}</p>
          <div className="mt-1.5 flex gap-4">
            <button onClick={() => iniciarEdicao(prova)} className="botao-texto text-xs">
              Editar
            </button>
            <button onClick={() => handleExcluir(prova.id)} className="botao-perigo text-xs">
              Excluir
            </button>
          </div>
        </div>

        <p className={`numeros shrink-0 text-sm ${!realizada && dias <= 3 ? "font-medium text-urgente" : "text-lapis"}`}>
          {realizada ? "realizada" : descreverPrazo(dias)}
        </p>
      </li>
    );
  }

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="titulo-pagina">Provas</h1>
          <p className="mt-1 text-lapis">
            {proximas.length === 0
              ? "Nenhuma prova marcada"
              : `Próxima ${descreverPrazo(diasAte(proximas[0].data))}`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filtroDisciplinaId}
            onChange={(evento) => setFiltroDisciplinaId(evento.target.value)}
            className="campo h-9 w-auto py-0"
            aria-label="Filtrar por disciplina"
          >
            <option value="">Todas as disciplinas</option>
            {disciplinas.map((disciplina) => (
              <option key={disciplina.id} value={disciplina.id}>
                {disciplina.nome}
              </option>
            ))}
          </select>
          {!formAberto && (
            <button onClick={abrirNovaProva} className="botao botao-primario">
              <Icone nome="mais" tamanho={16} />
              Nova prova
            </button>
          )}
        </div>
      </header>

      {formAberto && (
        <section className="painel mb-8 p-5 sm:p-6">
          <h2 className="titulo-secao mb-5">
            {provaEditando ? "Editar prova" : "Nova prova"}
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="disciplina" className="rotulo">Disciplina</label>
              <select
                id="disciplina"
                value={disciplinaId}
                onChange={(evento) => setDisciplinaId(evento.target.value)}
                className="campo"
              >
                <option value="">Selecione uma disciplina</option>
                {disciplinasDisponiveis.map((disciplina) => (
                  <option key={disciplina.id} value={disciplina.id}>
                    {disciplina.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="nome" className="rotulo">Nome</label>
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(evento) => setNome(evento.target.value)}
                placeholder="P1"
                className="campo"
              />
            </div>

            <div>
              <label htmlFor="data" className="rotulo">Data</label>
              <input
                id="data"
                type="date"
                value={data}
                onChange={(evento) => setData(evento.target.value)}
                className="campo"
              />
            </div>

            {erro && <p className="erro sm:col-span-3">{erro}</p>}

            <div className="flex gap-2 sm:col-span-3">
              <button type="submit" className="botao botao-primario">
                {provaEditando ? "Salvar alterações" : "Criar prova"}
              </button>
              <button type="button" onClick={cancelarEdicao} className="botao botao-secundario">
                Cancelar
              </button>
            </div>
          </form>
        </section>
      )}

      {erro && !formAberto && <p className="erro mb-4">{erro}</p>}

      {carregando ? (
        <p className="text-sm text-lapis">Carregando...</p>
      ) : provas.length === 0 ? (
        <div className="painel px-6 py-10 text-center">
          <p className="font-medium">Nenhuma prova cadastrada</p>
          <p className="mt-1 text-sm text-lapis">
            Cadastre as datas das provas para vê-las na semana da página inicial.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {proximas.length > 0 && (
            <section>
              <h2 className="mb-2 text-sm font-medium text-lapis">Próximas</h2>
              <ul className="painel lista">{proximas.map(renderLinha)}</ul>
            </section>
          )}
          {realizadas.length > 0 && (
            <section>
              <h2 className="mb-2 text-sm font-medium text-lapis">Realizadas</h2>
              <ul className="painel lista">{realizadas.map(renderLinha)}</ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
