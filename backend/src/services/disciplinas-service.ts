import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface Horario {
  diaSemana: number;
  turno: string;
  slotInicio: number;
  slotFim: number;
}

export async function criar(
  usuarioId: string,
  nome: string,
  professor: string | undefined,
  cor: string | undefined,
  periodo: string | undefined,
  horarios: Horario[] | undefined
) {
  const disciplina = await prisma.disciplina.create({
    data: {
      nome,
      professor,
      cor,
      periodo,
      usuarioId,
      horarios: horarios ? { create: horarios } : undefined,
    },
    include: {
      horarios: true,
    },
  });

  return disciplina;
}

export async function listar(usuarioId: string) {
  const disciplinas = await prisma.disciplina.findMany({
    where: { usuarioId },
    include: {
      horarios: true,
    },
  });

  return disciplinas;
}

export async function editar(
  usuarioId: string,
  id: string,
  nome: string,
  professor: string | undefined,
  cor: string | undefined,
  periodo: string | undefined,
  horarios: Horario[] | undefined
) {
  const disciplina = await prisma.disciplina.findUnique({
    where: { id },
  });

  if (!disciplina) {
    throw new Error("Disciplina não encontrada");
  }

  if (disciplina.usuarioId !== usuarioId) {
    throw new Error("Você não tem permissão para editar essa disciplina");
  }

  if (horarios) {
    await prisma.horarioAula.deleteMany({
      where: { disciplinaId: id },
    });
  }

  const disciplinaAtualizada = await prisma.disciplina.update({
    where: { id },
    data: {
      nome,
      professor,
      cor,
      periodo,
      horarios: horarios ? { create: horarios } : undefined,
    },
    include: {
      horarios: true,
    },
  });

  return disciplinaAtualizada;
}

export async function excluir(usuarioId: string, id: string) {
  const disciplina = await prisma.disciplina.findUnique({
    where: { id },
  });

  if (!disciplina) {
    throw new Error("Disciplina não encontrada");
  }

  if (disciplina.usuarioId !== usuarioId) {
    throw new Error("Você não tem permissão para excluir essa disciplina");
  }

  await prisma.disciplina.delete({
    where: { id },
  });
}