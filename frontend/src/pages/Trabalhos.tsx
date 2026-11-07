import { useState, useEffect, type FormEvent } from "react";
import * as disciplinasService from "../services/disciplinas";
import * as trabalhosService from "../services/trabalhos";
import Icone from "../components/Icone";
import { descreverPrazo, diasAte, formatarData } from "../utils/datas";

interface Disciplina {
  id: string;
  nome: string;
  cor: string;
  status: string;
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

  const [formAberto, setFormAberto] = useState(false);
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

  function disciplinaDe(id: string) {
    return disciplinas.find((d) => d.id === id);
  }

  const disciplinasDisponiveis = disciplinas.filter(
    (disciplina) => disciplina.status !== "concluida"
  );

  const pendentes = trabalhos
    .filter((trabalho) => trabalho.status === "pendente")
    .sort((a, b) => a.dataEntrega.localeCompare(b.dataEntrega));

  const concluidos = trabalhos
    .filter((trabalho) => trabalho.status !== "pendente")
    .sort((a, b) => b.dataEntrega.localeCompare(a.dataEntrega));

  function abrirNovoTrabalho() {
    cancelarEdicao();
    setDisciplinaId(filtroDisciplinaId);
    setFormAberto(true);
  }

  function iniciarEdicao(trabalho: Trabalho) {
    setTrabalhoEditando(trabalho);
    setDisciplinaId(trabalho.disciplinaId);
    setTitulo(trabalho.titulo);
    setDescricao(trabalho.descricao || "");
    setDataEntrega(trabalho.dataEntrega.slice(0, 10));
    setFormAberto(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelarEdicao() {
    setTrabalhoEditando(null);
    setDisciplinaId("");
    setTitulo("");
    setDescricao("");
    setDataEntrega("");
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
          ? "Não foi possível salvar as alterações. Confira o título e a data de entrega."
          : "Não foi possível criar o trabalho. Confira o título e a data de entrega."
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

  function renderLinha(trabalho: Trabalho) {
    const pendente = trabalho.status === "pendente";
    const disciplina = disciplinaDe(trabalho.disciplinaId);
    const dias = diasAte(trabalho.dataEntrega);

    return (
      <li key={trabalho.id} className="group flex items-start gap-3 px-4 py-3">
        <button
          onClick={() => pendente && handleConcluir(trabalho.id)}
          disabled={!pendente}
          className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border transition-colors ${
            pendente
              ? "border-lapis/60 hover:border-tinta hover:bg-tinta/10"
              : "border-transparent bg-lapis/30"
          }`}
          aria-label={pendente ? `Concluir ${trabalho.titulo}` : `${trabalho.titulo} concluído`}
          title={pendente ? "Marcar como concluído" : "Concluído"}
        >
          {!pendente && <Icone nome="check" tamanho={12} />}
        </button>

        <div className="min-w-0 flex-1">
          <p className={`text-sm font-medium ${pendente ? "" : "text-lapis line-through"}`}>
            {trabalho.titulo}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-lapis">
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: disciplina?.cor ?? "rgb(var(--lapis))" }}
              aria-hidden="true"
            />
            <span className="truncate">{disciplina?.nome ?? "Disciplina removida"}</span>
          </p>
          <div className="mt-2 flex gap-4">
            <button onClick={() => iniciarEdicao(trabalho)} className="botao-texto text-xs">
              Editar
            </button>
            <button onClick={() => handleExcluir(trabalho.id)} className="botao-perigo text-xs">
              Excluir
            </button>
          </div>
        </div>

        <div className="shrink-0 text-right">
          {pendente && (
            <p className={`numeros text-sm ${dias <= 3 ? "font-medium text-urgente" : ""}`}>
              {descreverPrazo(dias)}
            </p>
          )}
          <p className="numeros text-xs text-lapis">{formatarData(trabalho.dataEntrega)}</p>
        </div>
      </li>
    );
  }

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="titulo-pagina">Trabalhos</h1>
          <p className="mt-1 text-lapis">
            {pendentes.length === 0
              ? "Nada pendente"
              : `${pendentes.length} ${pendentes.length === 1 ? "pendente" : "pendentes"}`}
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
            <button onClick={abrirNovoTrabalho} className="botao botao-primario">
              <Icone nome="mais" tamanho={16} />
              Novo trabalho
            </button>
          )}
        </div>
      </header>

      {formAberto && (
        <section className="painel mb-8 p-5 sm:p-6">
          <h2 className="titulo-secao mb-5">
            {trabalhoEditando ? "Editar trabalho" : "Novo trabalho"}
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              <label htmlFor="titulo" className="rotulo">Título</label>
              <input
                id="titulo"
                type="text"
                value={titulo}
                onChange={(evento) => setTitulo(evento.target.value)}
                placeholder="Relatório do laboratório 3"
                className="campo"
              />
            </div>

            <div>
              <label htmlFor="descricao" className="rotulo">Descrição</label>
              <input
                id="descricao"
                type="text"
                value={descricao}
                onChange={(evento) => setDescricao(evento.target.value)}
                className="campo"
              />
            </div>

            <div>
              <label htmlFor="entrega" className="rotulo">Data de entrega</label>
              <input
                id="entrega"
                type="date"
                value={dataEntrega}
                onChange={(evento) => setDataEntrega(evento.target.value)}
                className="campo"
              />
            </div>

            {erro && <p className="erro sm:col-span-2">{erro}</p>}

            <div className="flex gap-2 sm:col-span-2">
              <button type="submit" className="botao botao-primario">
                {trabalhoEditando ? "Salvar alterações" : "Criar trabalho"}
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
      ) : trabalhos.length === 0 ? (
        <div className="painel px-6 py-10 text-center">
          <p className="font-medium">Nenhum trabalho cadastrado</p>
          <p className="mt-1 text-sm text-lapis">
            Cadastre trabalhos para acompanhar os prazos na semana da página inicial.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {pendentes.length > 0 && (
            <section>
              <h2 className="mb-2 text-sm font-medium text-lapis">Pendentes</h2>
              <ul className="painel lista">{pendentes.map(renderLinha)}</ul>
            </section>
          )}
          {concluidos.length > 0 && (
            <section>
              <h2 className="mb-2 text-sm font-medium text-lapis">Concluídos</h2>
              <ul className="painel lista">{concluidos.map(renderLinha)}</ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
