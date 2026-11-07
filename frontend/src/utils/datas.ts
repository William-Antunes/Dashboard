const UM_DIA_EM_MS = 1000 * 60 * 60 * 24;

// As datas vêm do backend como "2026-11-10T00:00:00.000Z" (meia-noite UTC).
// Usar só a parte AAAA-MM-DD evita que o fuso de Brasília empurre o dia para trás.
export function dataLocal(iso: string): Date {
  const [ano, mes, dia] = iso.slice(0, 10).split("-").map(Number);
  return new Date(ano, mes - 1, dia);
}

export function hoje(): Date {
  const agora = new Date();
  return new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
}

export function somarDias(data: Date, dias: number): Date {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate() + dias);
}

export function mesmoDia(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// Segunda-feira da semana da data informada
export function inicioDaSemana(data: Date): Date {
  const diaDaSemana = data.getDay(); // 0 = domingo
  const voltar = diaDaSemana === 0 ? 6 : diaDaSemana - 1;
  return somarDias(data, -voltar);
}

export function diasAte(iso: string): number {
  return Math.round((dataLocal(iso).getTime() - hoje().getTime()) / UM_DIA_EM_MS);
}

export function formatarData(iso: string): string {
  return dataLocal(iso).toLocaleDateString("pt-BR");
}

export function descreverPrazo(dias: number): string {
  if (dias < -1) return `atrasado há ${-dias} dias`;
  if (dias === -1) return "atrasado desde ontem";
  if (dias === 0) return "hoje";
  if (dias === 1) return "amanhã";
  return `em ${dias} dias`;
}

export function mesCurto(data: Date): string {
  return data.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
}

export function diaDaSemanaCurto(data: Date): string {
  return data.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
}
