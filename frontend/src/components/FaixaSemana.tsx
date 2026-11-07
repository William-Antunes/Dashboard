import { useState } from "react";
import { Link } from "react-router-dom";
import Icone from "./Icone";
import {
  dataLocal,
  diaDaSemanaCurto,
  hoje,
  inicioDaSemana,
  mesCurto,
  mesmoDia,
  somarDias,
} from "../utils/datas";
import { fundoDaCor } from "../utils/disciplinas";

export interface EventoDaSemana {
  id: string;
  tipo: "prova" | "trabalho";
  titulo: string;
  data: string;
  disciplina?: { id: string; nome: string; cor: string };
}

function descreverIntervalo(inicio: Date, fim: Date): string {
  if (inicio.getMonth() === fim.getMonth()) {
    return `${inicio.getDate()} a ${fim.getDate()} de ${mesCurto(fim)}`;
  }
  return `${inicio.getDate()} de ${mesCurto(inicio)} a ${fim.getDate()} de ${mesCurto(fim)}`;
}

export default function FaixaSemana({ eventos }: { eventos: EventoDaSemana[] }) {
  const [deslocamento, setDeslocamento] = useState(0);

  const diaDeHoje = hoje();
  const segunda = somarDias(inicioDaSemana(diaDeHoje), deslocamento * 7);
  const dias = Array.from({ length: 7 }, (_, i) => somarDias(segunda, i));

  const eventosPorDia = dias.map((dia) =>
    eventos
      .filter((evento) => mesmoDia(dataLocal(evento.data), dia))
      .sort((a, b) => (a.tipo === b.tipo ? 0 : a.tipo === "prova" ? -1 : 1))
  );

  let ordemDeEntrada = 0;

  return (
    <section aria-label="Sua semana">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className="titulo-secao">
          {deslocamento === 0 ? "Esta semana" : `Semana de ${descreverIntervalo(dias[0], dias[6])}`}
        </h2>
        <div className="flex items-center gap-1">
          {deslocamento !== 0 && (
            <button onClick={() => setDeslocamento(0)} className="botao-texto mr-2">
              Voltar para hoje
            </button>
          )}
          <button
            onClick={() => setDeslocamento(deslocamento - 1)}
            className="botao-icone"
            aria-label="Semana anterior"
          >
            <Icone nome="anterior" />
          </button>
          <button
            onClick={() => setDeslocamento(deslocamento + 1)}
            className="botao-icone"
            aria-label="Próxima semana"
          >
            <Icone nome="proximo" />
          </button>
        </div>
      </div>

      <div className="papel-milimetrado overflow-hidden rounded-painel border border-linha">
        <ol key={deslocamento} className="grid grid-cols-1 md:grid-cols-7">
          {dias.map((dia, indice) => {
            const ehHoje = mesmoDia(dia, diaDeHoje);
            const passou = dia < diaDeHoje;
            const doDia = eventosPorDia[indice];

            return (
              <li
                key={dia.toISOString()}
                className={`flex gap-4 border-linha px-3 py-3 md:min-h-[176px] md:flex-col md:gap-3 md:py-4 ${
                  indice > 0 ? "border-t md:border-l md:border-t-0" : ""
                } ${ehHoje ? "bg-tinta/[0.06] shadow-[inset_0_2px_0_rgb(var(--tinta))]" : ""}`}
                aria-current={ehHoje ? "date" : undefined}
              >
                <div className={`w-12 shrink-0 md:w-auto ${passou ? "opacity-60" : ""}`}>
                  <p className={`text-xs ${ehHoje ? "font-medium text-tinta" : "text-lapis"}`}>
                    {ehHoje ? "hoje" : diaDaSemanaCurto(dia)}
                  </p>
                  <p
                    className={`condensado numeros text-[32px] font-semibold leading-none tracking-tight ${
                      ehHoje ? "text-tinta" : ""
                    }`}
                  >
                    {dia.getDate()}
                  </p>
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  {doDia.map((evento) => {
                    const cor = evento.disciplina?.cor ?? "rgb(var(--lapis))";
                    const atraso = ordemDeEntrada++ * 45;

                    return (
                      <Link
                        key={`${evento.tipo}-${evento.id}`}
                        to={evento.disciplina ? `/disciplinas/${evento.disciplina.id}` : "#"}
                        className="surgir block rounded-[5px] border-l-[3px] px-2 py-1.5 transition-[filter] hover:brightness-95 dark:hover:brightness-110"
                        style={{
                          borderLeftColor: cor,
                          backgroundColor: fundoDaCor(cor, evento.tipo === "prova" ? 22 : 12),
                          animationDelay: `${atraso}ms`,
                        }}
                      >
                        <p className="text-[11px] text-lapis">
                          {evento.tipo === "prova" ? "Prova" : "Entrega"}
                        </p>
                        <p className="line-clamp-2 text-[13px] font-medium leading-snug">
                          {evento.titulo}
                        </p>
                        {evento.disciplina && (
                          <p className="truncate text-[11px] text-lapis">{evento.disciplina.nome}</p>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
