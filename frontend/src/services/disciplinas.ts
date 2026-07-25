import api from "./api";

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

interface DadosDisciplina {
  nome: string;
  professor?: string;
  cor?: string;
  periodo?: string;
  horarios?: Horario[];
}

export async function listar(): Promise<Disciplina[]> {
  const resposta = await api.get("/disciplinas");
  return resposta.data;
}

export async function criar(dados: DadosDisciplina): Promise<Disciplina> {
  const resposta = await api.post("/disciplinas", dados);
  return resposta.data;
}

export async function editar(
  id: string,
  dados: DadosDisciplina
): Promise<Disciplina> {
  const resposta = await api.put(`/disciplinas/${id}`, dados);
  return resposta.data;
}

export async function excluir(id: string): Promise<void> {
  await api.delete(`/disciplinas/${id}`);
}