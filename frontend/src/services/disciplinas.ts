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
  status: string;
  notaFinal: number | null;
  cargaHoraria: number | null;
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

interface DadosConclusao {
  notaFinal: number;
  cargaHoraria: number;
}

export async function listar(status?: string): Promise<Disciplina[]> {
  const resposta = await api.get("/disciplinas", {
    params: status ? { status } : {},
  });
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

export async function concluir(
  id: string,
  dados: DadosConclusao
): Promise<Disciplina> {
  const resposta = await api.patch(`/disciplinas/${id}/concluir`, dados);
  return resposta.data;
}

export async function excluir(id: string): Promise<void> {
  await api.delete(`/disciplinas/${id}`);
}
