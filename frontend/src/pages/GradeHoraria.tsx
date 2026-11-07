import { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import * as disciplinasService from "../services/disciplinas";
import { fundoDaCor } from "../utils/disciplinas";

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
  { valor: 2, nome: "Segunda", curto: "Seg" },
  { valor: 3, nome: "Terça", curto: "Ter" },
  { valor: 4, nome: "Quarta", curto: "Qua" },
  { valor: 5, nome: "Quinta", curto: "Qui" },
  { valor: 6, nome: "Sexta", curto: "Sex" },
  { valor: 7, nome: "Sábado", curto: "Sáb" },
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
    disciplinasService
      .listar("cursando")
      .then(setDisciplinas)
      .finally(() => setCarregando(false));
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

  // Esconde turnos sem nenhuma aula, para a grade não ficar com linhas vazias
  const turnosComAula = (["M", "T", "N"] as const).filter((turno) =>
    disciplinas.some((d) => d.horarios.some((h) => h.turno === turno))
  );

  // getDay(): 0 = domingo, então segunda = 1 vira diaSemana 2
  const diaSemanaHoje = new Date().getDay() + 1;

  if (carregando) {
    return <p className="text-sm text-lapis">Carregando...</p>;
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="titulo-pagina">Grade horária</h1>
        <p className="mt-1 text-lapis">
          Montada a partir dos horários de cada disciplina em andamento.
        </p>
      </header>

      {turnosComAula.length === 0 ? (
        <div className="painel px-6 py-10 text-center">
          <p className="font-medium">Sua grade está vazia</p>
          <p className="mt-1 text-sm text-lapis">
            Adicione horários às suas{" "}
            <Link to="/disciplinas" className="link">
              disciplinas
            </Link>{" "}
            e elas aparecem aqui.
          </p>
        </div>
      ) : (
        <div className="papel-milimetrado overflow-x-auto rounded-painel border border-linha">
          <table className="w-full min-w-[720px] table-fixed border-collapse text-sm">
            <thead>
              <tr>
                <th className="w-[104px] border-b border-linha bg-folha px-3 py-2.5 text-left text-xs font-medium text-lapis">
                  <span className="sr-only">Horário</span>
                </th>
                {DIAS.map((dia) => {
                  const ehHoje = dia.valor === diaSemanaHoje;
                  return (
                    <th
                      key={dia.valor}
                      className={`border-b border-l border-linha bg-folha px-3 py-2.5 text-left text-xs font-medium ${
                        ehHoje ? "text-tinta shadow-[inset_0_2px_0_rgb(var(--tinta))]" : "text-lapis"
                      }`}
                    >
                      <abbr title={dia.nome} className="no-underline">
                        {dia.curto}
                      </abbr>
                      {ehHoje && <span className="ml-1.5 font-normal">hoje</span>}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {turnosComAula.map((turno) => (
                <Fragment key={turno}>
                  <tr>
                    <th
                      colSpan={7}
                      scope="colgroup"
                      className="border-b border-linha bg-papel/80 px-3 py-1.5 text-left text-xs font-medium text-lapis"
                    >
                      {NOME_TURNO[turno]}
                    </th>
                  </tr>
                  {HORARIOS_POR_TURNO[turno].map((h) => (
                    <tr key={`${turno}-${h.slot}`}>
                      <th
                        scope="row"
                        className="whitespace-nowrap border-b border-linha bg-folha/70 px-3 py-1.5 text-left text-xs font-normal text-lapis"
                      >
                        <span className="numeros">{h.inicio}</span>
                        <span className="numeros block text-[11px] opacity-70">{h.fim}</span>
                      </th>
                      {DIAS.map((dia) => {
                        const disciplina = disciplinaNaCelula(dia.valor, turno, h.slot);
                        return (
                          <td key={dia.valor} className="h-12 border-b border-l border-linha p-1">
                            {disciplina && (
                              <Link
                                to={`/disciplinas/${disciplina.id}`}
                                className="flex h-full items-center rounded-[4px] border-l-[3px] px-2 text-xs font-medium leading-tight transition-[filter] hover:brightness-95 dark:hover:brightness-110"
                                style={{
                                  borderLeftColor: disciplina.cor,
                                  backgroundColor: fundoDaCor(disciplina.cor, 18),
                                }}
                              >
                                <span className="line-clamp-2">{disciplina.nome}</span>
                              </Link>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
