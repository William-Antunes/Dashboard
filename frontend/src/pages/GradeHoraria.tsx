import { useState, useEffect } from "react";
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
  cor: string;
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

const HORARIOS_POR_TURNO: Record<string, { slot: number; inicio: string; fim: string }[]> = {
  M: [
    { slot: 1, inicio: "07:00", fim: "07:55" },
    { slot: 2, inicio: "07:55", fim: "08:50" },
    { slot: 3, inicio: "08:50", fim: "09:45" },
    { slot: 4, inicio: "10:10", fim: "11:05" },
    { slot: 5, inicio: "11:05", fim: "12:00" },
  ],
  T: [
    { slot: 1, inicio: "13:30", fim: "14:25" },
    { slot: 2, inicio: "14:25", fim: "15:20" },
    { slot: 3, inicio: "15:45", fim: "16:40" },
    { slot: 4, inicio: "16:40", fim: "17:35" },
    { slot: 5, inicio: "17:35", fim: "18:30" },
  ],
  N: [
    { slot: 1, inicio: "19:00", fim: "19:50" },
    { slot: 2, inicio: "19:50", fim: "20:40" },
    { slot: 3, inicio: "21:00", fim: "21:50" },
    { slot: 4, inicio: "21:50", fim: "22:40" },
    { slot: 5, inicio: "22:40", fim: "23:30" },
  ],
};

const NOME_TURNO: Record<string, string> = { M: "Manhã", T: "Tarde", N: "Noite" };

export default function GradeHoraria() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    disciplinasService.listar("cursando").then((dados) => {
      setDisciplinas(dados);
      setCarregando(false);
    });
  }, []);

  function disciplinaNaCelula(
    diaSemana: number,
    turno: string,
    slot: number
  ): Disciplina | null {
    for (const disciplina of disciplinas) {
      for (const horario of disciplina.horarios) {
        if (
          horario.diaSemana === diaSemana &&
          horario.turno === turno &&
          slot >= horario.slotInicio &&
          slot <= horario.slotFim
        ) {
          return disciplina;
        }
      }
    }
    return null;
  }

  if (carregando) {
    return <p className="p-6 text-gray-400">Carregando...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-semibold text-white mb-6">Grade Horária</h1>

      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-x-auto">
        <table className="w-full table-fixed text-sm min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400">
              <th className="px-3 py-2 text-left">Horário</th>
              {DIAS.map((dia) => (
                <th key={dia.valor} className="px-3 py-2 text-left">
                  {dia.nome}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(["M", "T", "N"] as const).map((turno) => (
              <>
                <tr key={`turno-${turno}`} className="bg-gray-900">
                  <td colSpan={7} className="px-3 py-1 text-xs text-gray-500 font-medium">
                    {NOME_TURNO[turno]}
                  </td>
                </tr>
                {HORARIOS_POR_TURNO[turno].map((h) => (
                  <tr key={`${turno}-${h.slot}`} className="border-b border-gray-700 last:border-0">
                    <td className="px-3 py-2 text-gray-400 whitespace-nowrap">
                      {h.inicio} – {h.fim}
                    </td>
                    {DIAS.map((dia) => {
                      const disciplina = disciplinaNaCelula(dia.valor, turno, h.slot);
                      return (
                        <td key={dia.valor} className="px-3 py-2">
                          {disciplina ? (
                            <Link
                              to={`/disciplinas/${disciplina.id}`}
                              className="block rounded-md px-2 py-1 text-xs font-medium text-white hover:opacity-80 transition-opacity"
                              style={{ backgroundColor: disciplina.cor }}
                            >
                              {disciplina.nome}
                            </Link>
                          ) : (
                            <span className="text-gray-700">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}