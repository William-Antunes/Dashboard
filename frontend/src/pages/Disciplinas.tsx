import { useState, useEffect, type FormEvent } from "react";
import { Link } from "react-router-dom";
import * as disciplinasService from "../services/disciplinas";
import Icone from "../components/Icone";
import MedidorFaltas from "../components/MedidorFaltas";
import { CORES_DISCIPLINA, formatarNota, resumirHorario } from "../utils/disciplinas";

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
  notaFinal: number | null;
  cargaHoraria: number | null;
  faltas: number;
  usuarioId: string;
  horarios: Horario[];
}

const DIAS = [
  { valor: 2, nome: "Segunda" },
  { valor: 3, nome: "Terça" },
  { valor: 4, nome: "Quarta" },
  { valor: 5, nome: "Quinta" },
  { valor: 6, nome: "Sexta" },
  { valor: 7, nome: "Sábado" },
];

const TURNOS = [
  { valor: "M", nome: "Manhã" },
  { valor: "T", nome: "Tarde" },
  { valor: "N", nome: "Noite" },
];

const SLOTS = [1, 2, 3, 4, 5];

function horarioVazio(): Horario {
  return { diaSemana: 2, turno: "M", slotInicio: 1, slotFim: 1 };
}

export default function Disciplinas() {
  const [aba, setAba] = useState<"cursando" | "concluida">("cursando");
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [formAberto, setFormAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [professor, setProfessor] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [cargaHoraria, setCargaHoraria] = useState("");
  const [cor, setCor] = useState(CORES_DISCIPLINA[0].valor);
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [disciplinaEditando, setDisciplinaEditando] = useState<Disciplina | null>(
    null
  );
  const [concluindoId, setConcluindoId] = useState<string | null>(null);
  const [notaFinal, setNotaFinal] = useState("");

  useEffect(() => {
    carregarDisciplinas();
  }, [aba]);

  async function carregarDisciplinas() {
    setCarregando(true);
    try {
      const dados = await disciplinasService.listar(aba);
      setDisciplinas(dados);
    } catch {
      setErro("Não foi possível carregar as disciplinas");
    } finally {
      setCarregando(false);
    }
  }

  function abrirNovaDisciplina() {
    cancelarEdicao();
    // Sugere uma cor que ainda não está em uso
    const emUso = new Set(disciplinas.map((d) => d.cor.toUpperCase()));
    const livre = CORES_DISCIPLINA.find((c) => !emUso.has(c.valor.toUpperCase()));
    setCor((livre ?? CORES_DISCIPLINA[0]).valor);
    setFormAberto(true);
  }

  function iniciarEdicao(disciplina: Disciplina) {
    setDisciplinaEditando(disciplina);
    setNome(disciplina.nome);
    setProfessor(disciplina.professor || "");
    setPeriodo(disciplina.periodo || "");
    setCargaHoraria(disciplina.cargaHoraria ? String(disciplina.cargaHoraria) : "");
    setCor(disciplina.cor);
    setHorarios(
      disciplina.horarios.map((h) => ({
        diaSemana: h.diaSemana,
        turno: h.turno,
        slotInicio: h.slotInicio,
        slotFim: h.slotFim,
      }))
    );
    setFormAberto(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelarEdicao() {
    setDisciplinaEditando(null);
    setNome("");
    setProfessor("");
    setPeriodo("");
    setCargaHoraria("");
    setHorarios([]);
    setErro("");
    setFormAberto(false);
  }

  function adicionarHorario() {
    setHorarios([...horarios, horarioVazio()]);
  }

  function removerHorario(index: number) {
    setHorarios(horarios.filter((_, i) => i !== index));
  }

  function atualizarHorario(index: number, campo: keyof Horario, valor: number | string) {
    const novosHorarios = [...horarios];
    novosHorarios[index] = { ...novosHorarios[index], [campo]: valor };
    setHorarios(novosHorarios);
  }

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setErro("");

    const dados = {
      nome,
      professor,
      periodo,
      cor,
      cargaHoraria: Number(cargaHoraria),
      horarios,
    };

    try {
      if (disciplinaEditando) {
        await disciplinasService.editar(disciplinaEditando.id, dados);
      } else {
        await disciplinasService.criar(dados);
      }

      cancelarEdicao();
      carregarDisciplinas();
    } catch {
      setErro(
        disciplinaEditando
          ? "Não foi possível salvar as alterações. Confira se nome e carga horária estão preenchidos."
          : "Não foi possível adicionar a disciplina. Confira se nome e carga horária estão preenchidos."
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

  function iniciarConclusao(id: string) {
    setConcluindoId(id);
    setNotaFinal("");
  }

  function cancelarConclusao() {
    setConcluindoId(null);
  }

  async function handleConcluir(id: string) {
    try {
      await disciplinasService.concluir(id, {
        notaFinal: Number(notaFinal),
      });
      setConcluindoId(null);
      carregarDisciplinas();
    } catch {
      setErro("Não foi possível concluir a disciplina. A nota final precisa estar entre 0 e 10.");
    }
  }

  async function handleFalta(id: string, delta: number) {
    try {
      const atualizada = await disciplinasService.registrarFalta(id, delta);
      setDisciplinas((atual) =>
        atual.map((disciplina) => (disciplina.id === id ? atualizada : disciplina))
      );
    } catch {
      setErro("Não foi possível atualizar as faltas");
    }
  }

  function agruparPorPeriodo(lista: Disciplina[]): [string, Disciplina[]][] {
    const grupos = new Map<string, Disciplina[]>();

    for (const disciplina of lista) {
      const chave = disciplina.periodo || "Período não informado";
      if (!grupos.has(chave)) grupos.set(chave, []);
      grupos.get(chave)!.push(disciplina);
    }

    return Array.from(grupos.entries()).sort(([a], [b]) => {
      if (a === "Período não informado") return 1;
      if (b === "Período não informado") return -1;
      return b.localeCompare(a);
    });
  }

  function renderLinha(disciplina: Disciplina) {
    return (
      <li key={disciplina.id} className="px-4 py-4">
        <div className="flex flex-wrap items-start gap-x-4 gap-y-3">
          <span
            className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: disciplina.cor }}
            aria-hidden="true"
          />

          <div className="min-w-0 flex-1 basis-56">
            <Link
              to={`/disciplinas/${disciplina.id}`}
              className="font-medium hover:text-tinta"
            >
              {disciplina.nome}
            </Link>
            <p className="text-sm text-lapis">
              {disciplina.professor || "Professor não informado"}
              {aba === "cursando" && disciplina.periodo ? `, ${disciplina.periodo}` : ""}
            </p>
            {aba === "cursando" && disciplina.horarios.length > 0 && (
              <p className="mt-1 text-xs text-lapis">
                {disciplina.horarios.map(resumirHorario).join("  /  ")}
              </p>
            )}
          </div>

          {aba === "concluida" ? (
            <div className="text-right">
              <p className="condensado numeros text-2xl font-semibold leading-none">
                {disciplina.notaFinal !== null ? formatarNota(disciplina.notaFinal) : "—"}
              </p>
              <p className="numeros mt-1 text-xs text-lapis">{disciplina.cargaHoraria}h</p>
            </div>
          ) : (
            disciplina.cargaHoraria && (
              <div className="flex items-center gap-2">
                <MedidorFaltas faltas={disciplina.faltas} cargaHoraria={disciplina.cargaHoraria} />
                <div className="flex">
                  <button
                    onClick={() => handleFalta(disciplina.id, -1)}
                    className="botao-icone h-7 w-7"
                    aria-label={`Remover uma falta de ${disciplina.nome}`}
                  >
                    −
                  </button>
                  <button
                    onClick={() => handleFalta(disciplina.id, 1)}
                    className="botao-icone h-7 w-7"
                    aria-label={`Registrar uma falta em ${disciplina.nome}`}
                  >
                    +
                  </button>
                </div>
              </div>
            )
          )}
        </div>

        <div className="mt-3 flex gap-4 pl-[26px]">
          {aba === "cursando" && (
            <>
              <button onClick={() => iniciarEdicao(disciplina)} className="botao-texto">
                Editar
              </button>
              <button onClick={() => iniciarConclusao(disciplina.id)} className="botao-texto">
                Concluir
              </button>
            </>
          )}
          <button onClick={() => handleExcluir(disciplina.id)} className="botao-perigo">
            Excluir
          </button>
        </div>

        {concluindoId === disciplina.id && (
          <form
            onSubmit={(evento) => {
              evento.preventDefault();
              handleConcluir(disciplina.id);
            }}
            className="ml-[26px] mt-3 flex flex-wrap items-center gap-3 rounded-controle bg-realce/60 p-3"
          >
            <label htmlFor={`nota-${disciplina.id}`} className="text-sm">
              Nota final
            </label>
            <input
              id={`nota-${disciplina.id}`}
              type="number"
              step="0.1"
              min="0"
              max="10"
              placeholder="0 a 10"
              value={notaFinal}
              onChange={(evento) => setNotaFinal(evento.target.value)}
              className="campo campo-compacto w-24"
              autoFocus
            />
            <button type="submit" className="botao botao-primario h-8">
              Concluir disciplina
            </button>
            <button type="button" onClick={cancelarConclusao} className="botao-texto">
              Cancelar
            </button>
          </form>
        )}
      </li>
    );
  }

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="titulo-pagina">Disciplinas</h1>
          <div className="mt-4 inline-flex rounded-controle border border-linha bg-folha p-0.5" role="tablist">
            {(
              [
                { valor: "cursando", nome: "Cursando" },
                { valor: "concluida", nome: "Concluídas" },
              ] as const
            ).map((opcao) => (
              <button
                key={opcao.valor}
                role="tab"
                aria-selected={aba === opcao.valor}
                onClick={() => {
                  setAba(opcao.valor);
                  cancelarEdicao();
                }}
                className={`h-7 rounded-[4px] px-3 text-sm transition-colors ${
                  aba === opcao.valor
                    ? "bg-realce font-medium text-grafite"
                    : "text-lapis hover:text-grafite"
                }`}
              >
                {opcao.nome}
              </button>
            ))}
          </div>
        </div>

        {aba === "cursando" && !formAberto && (
          <button onClick={abrirNovaDisciplina} className="botao botao-primario">
            <Icone nome="mais" tamanho={16} />
            Adicionar disciplina
          </button>
        )}
      </header>

      {aba === "cursando" && formAberto && (
        <section className="painel mb-8 p-5 sm:p-6">
          <h2 className="titulo-secao mb-5">
            {disciplinaEditando ? `Editar ${disciplinaEditando.nome}` : "Nova disciplina"}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="nome" className="rotulo">Nome</label>
                <input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(evento) => setNome(evento.target.value)}
                  placeholder="Cálculo 2"
                  className="campo"
                />
              </div>

              <div>
                <label htmlFor="professor" className="rotulo">Professor</label>
                <input
                  id="professor"
                  type="text"
                  value={professor}
                  onChange={(evento) => setProfessor(evento.target.value)}
                  className="campo"
                />
              </div>

              <div>
                <label htmlFor="periodo" className="rotulo">Período</label>
                <input
                  id="periodo"
                  type="text"
                  value={periodo}
                  onChange={(evento) => setPeriodo(evento.target.value)}
                  placeholder="2026.2"
                  className="campo"
                />
              </div>

              <div>
                <label htmlFor="carga" className="rotulo">Carga horária</label>
                <input
                  id="carga"
                  type="number"
                  min="1"
                  value={cargaHoraria}
                  onChange={(evento) => setCargaHoraria(evento.target.value)}
                  placeholder="60"
                  className="campo"
                />
              </div>
            </div>

            <fieldset>
              <legend className="rotulo">Cor</legend>
              <div className="flex flex-wrap gap-2">
                {CORES_DISCIPLINA.map((opcao) => {
                  const selecionada = opcao.valor.toUpperCase() === cor.toUpperCase();
                  return (
                    <button
                      key={opcao.valor}
                      type="button"
                      onClick={() => setCor(opcao.valor)}
                      aria-label={opcao.nome}
                      aria-pressed={selecionada}
                      title={opcao.nome}
                      className={`flex h-8 w-8 items-center justify-center rounded-full transition-shadow ${
                        selecionada ? "ring-2 ring-grafite ring-offset-2 ring-offset-folha" : ""
                      }`}
                      style={{ backgroundColor: opcao.valor }}
                    >
                      {selecionada && <Icone nome="check" tamanho={14} className="text-white" />}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="rotulo mb-0">Horários</span>
                <button type="button" onClick={adicionarHorario} className="botao-texto inline-flex items-center gap-1 text-tinta hover:text-tinta">
                  <Icone nome="mais" tamanho={14} />
                  Adicionar horário
                </button>
              </div>

              {horarios.length === 0 && (
                <p className="text-sm text-lapis">
                  Sem horários, a disciplina não aparece na grade horária.
                </p>
              )}

              <div className="flex flex-col gap-2">
                {horarios.map((horario, index) => (
                  <div
                    key={index}
                    className="flex flex-wrap items-center gap-2 rounded-controle border border-linha bg-papel p-2.5"
                  >
                    <select
                      value={horario.diaSemana}
                      onChange={(evento) =>
                        atualizarHorario(index, "diaSemana", Number(evento.target.value))
                      }
                      className="campo campo-compacto"
                      aria-label="Dia da semana"
                    >
                      {DIAS.map((dia) => (
                        <option key={dia.valor} value={dia.valor}>
                          {dia.nome}
                        </option>
                      ))}
                    </select>

                    <select
                      value={horario.turno}
                      onChange={(evento) =>
                        atualizarHorario(index, "turno", evento.target.value)
                      }
                      className="campo campo-compacto"
                      aria-label="Turno"
                    >
                      {TURNOS.map((turno) => (
                        <option key={turno.valor} value={turno.valor}>
                          {turno.nome}
                        </option>
                      ))}
                    </select>

                    <span className="text-sm text-lapis">do</span>

                    <select
                      value={horario.slotInicio}
                      onChange={(evento) =>
                        atualizarHorario(index, "slotInicio", Number(evento.target.value))
                      }
                      className="campo campo-compacto"
                      aria-label="Primeiro horário"
                    >
                      {SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}º
                        </option>
                      ))}
                    </select>

                    <span className="text-sm text-lapis">ao</span>

                    <select
                      value={horario.slotFim}
                      onChange={(evento) =>
                        atualizarHorario(index, "slotFim", Number(evento.target.value))
                      }
                      className="campo campo-compacto"
                      aria-label="Último horário"
                    >
                      {SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}º
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => removerHorario(index)}
                      className="botao-perigo ml-auto px-1"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {erro && <p className="erro">{erro}</p>}

            <div className="flex gap-2">
              <button type="submit" className="botao botao-primario">
                {disciplinaEditando ? "Salvar alterações" : "Adicionar disciplina"}
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
      ) : disciplinas.length === 0 ? (
        <div className="painel px-6 py-10 text-center">
          <p className="font-medium">
            {aba === "cursando"
              ? "Nenhuma disciplina em andamento"
              : "Nenhuma disciplina concluída ainda"}
          </p>
          <p className="mt-1 text-sm text-lapis">
            {aba === "cursando"
              ? "Adicione as matérias deste período para ver a grade, os prazos e as faltas."
              : "Quando concluir uma disciplina com a nota final, ela aparece aqui e entra no cálculo do IRA."}
          </p>
        </div>
      ) : aba === "concluida" ? (
        <div className="flex flex-col gap-8">
          {agruparPorPeriodo(disciplinas).map(([periodoNome, grupo]) => (
            <section key={periodoNome}>
              <h2 className="mb-2 text-sm font-medium text-lapis">{periodoNome}</h2>
              <ul className="painel lista">{grupo.map((disciplina) => renderLinha(disciplina))}</ul>
            </section>
          ))}
        </div>
      ) : (
        <ul className="painel lista">{disciplinas.map((disciplina) => renderLinha(disciplina))}</ul>
      )}
    </div>
  );
}
