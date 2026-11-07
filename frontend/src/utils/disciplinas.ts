interface Horario {
  diaSemana: number;
  turno: string;
  slotInicio: number;
  slotFim: number;
}

// Cores que mantêm contraste tanto no tema claro quanto no escuro
export const CORES_DISCIPLINA = [
  { valor: "#4C6EF5", nome: "Azul" },
  { valor: "#12B886", nome: "Verde" },
  { valor: "#F59F00", nome: "Âmbar" },
  { valor: "#E64980", nome: "Rosa" },
  { valor: "#7950F2", nome: "Violeta" },
  { valor: "#1C9CC4", nome: "Ciano" },
  { valor: "#F76707", nome: "Laranja" },
  { valor: "#74B816", nome: "Oliva" },
];

// Fundo translúcido na cor da disciplina, misturado com a superfície do tema
export function fundoDaCor(cor: string, porcentagem = 14): string {
  return `color-mix(in srgb, ${cor} ${porcentagem}%, rgb(var(--folha)))`;
}

export function limiteFaltas(cargaHoraria: number): number {
  return Math.floor(cargaHoraria * 0.25);
}

const DIAS_CURTOS: Record<number, string> = {
  2: "Seg",
  3: "Ter",
  4: "Qua",
  5: "Qui",
  6: "Sex",
  7: "Sáb",
};

const TURNOS_NOME: Record<string, string> = { M: "manhã", T: "tarde", N: "noite" };

export function resumirHorario(h: Horario): string {
  const slots =
    h.slotInicio === h.slotFim ? `${h.slotInicio}º` : `${h.slotInicio}º–${h.slotFim}º`;
  return `${DIAS_CURTOS[h.diaSemana] ?? ""} ${TURNOS_NOME[h.turno] ?? ""} ${slots}`;
}

export function formatarNota(nota: number): string {
  return nota.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  });
}
