import { useState, useEffect, type FormEvent } from "react";
import { Link } from "react-router-dom";
import * as disciplinasService from "../services/disciplinas";

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
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [nome, setNome] = useState("");
  const [professor, setProfessor] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [horarios, setHorarios] = useState<Horario[]>([]);
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
    setHorarios(
      disciplina.horarios.map((h) => ({
        diaSemana: h.diaSemana,
        turno: h.turno,
        slotInicio: h.slotInicio,
        slotFim: h.slotFim,
      }))
    );
  }

  function cancelarEdicao() {
    setDisciplinaEditando(null);
    setNome("");
    setProfessor("");
    setPeriodo("");
    setHorarios([]);
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

    try {
      if (disciplinaEditando) {
        await disciplinasService.editar(disciplinaEditando.id, {
          nome,
          professor,
          periodo,
          horarios,
        });
      } else {
        await disciplinasService.criar({ nome, professor, periodo, horarios });
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

  function formatarHorario(h: Horario): string {
    const dia = DIAS.find((d) => d.valor === h.diaSemana)?.nome || "";
    const turno = TURNOS.find((t) => t.valor === h.turno)?.nome || "";
    const slots =
      h.slotInicio === h.slotFim
        ? `${h.slotInicio}º horário`
        : `${h.slotInicio}º ao ${h.slotFim}º horário`;
    return `${dia} — ${turno} — ${slots}`;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-semibold text-white mb-6">Disciplinas</h1>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
        <h2 className="text-base font-medium text-white mb-4">
          {disciplinaEditando ? "Editar disciplina" : "Nova disciplina"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm text-gray-300">Horários</label>
              <button
                type="button"
                onClick={adicionarHorario}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                + Adicionar horário
              </button>
            </div>

            {horarios.length === 0 && (
              <p className="text-sm text-gray-500">Nenhum horário adicionado.</p>
            )}

            <div className="flex flex-col gap-2">
              {horarios.map((horario, index) => (
                <div
                  key={index}
                  className="flex flex-wrap items-center gap-2 bg-gray-900 border border-gray-700 rounded-lg p-3"
                >
                  <select
                    value={horario.diaSemana}
                    onChange={(evento) =>
                      atualizarHorario(index, "diaSemana", Number(evento.target.value))
                    }
                    className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-sm text-white"
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
                    className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-sm text-white"
                  >
                    {TURNOS.map((turno) => (
                      <option key={turno.valor} value={turno.valor}>
                        {turno.nome}
                      </option>
                    ))}
                  </select>

                  <span className="text-sm text-gray-400">do</span>

                  <select
                    value={horario.slotInicio}
                    onChange={(evento) =>
                      atualizarHorario(index, "slotInicio", Number(evento.target.value))
                    }
                    className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-sm text-white"
                  >
                    {SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}º
                      </option>
                    ))}
                  </select>

                  <span className="text-sm text-gray-400">ao</span>

                  <select
                    value={horario.slotFim}
                    onChange={(evento) =>
                      atualizarHorario(index, "slotFim", Number(evento.target.value))
                    }
                    className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-sm text-white"
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
                    className="text-sm text-red-400 hover:text-red-300 ml-auto"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          </div>

          {erro && <p className="text-sm text-red-400">{erro}</p>}

          <div className="flex gap-3">
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

              {disciplina.horarios.length > 0 && (
                <div className="mt-2 flex flex-col gap-1">
                  {disciplina.horarios.map((h, i) => (
                    <p key={i} className="text-xs text-gray-500">
                      {formatarHorario(h)}
                    </p>
                  ))}
                </div>
              )}

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