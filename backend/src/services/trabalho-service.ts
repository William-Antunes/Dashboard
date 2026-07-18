import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function confirmarDonoDaDisciplina(usuarioId: string, disciplinaId: string) {
  const disciplina = await prisma.disciplina.findUnique({
    where: { id: disciplinaId },
  });

  if (!disciplina) {
    throw new Error("Disciplina não encontrada");
  }

  if (disciplina.usuarioId !== usuarioId) {
    throw new Error("Você não tem permissão para usar essa disciplina");
  }
}

export async function criar(usuarioId: string, disciplinaId: string, titulo: string, descricao: string, dataEntrega: string) {
    await confirmarDonoDaDisciplina(usuarioId, disciplinaId);

    const trabalho = await prisma.trabalho.create({
        data: {
            titulo,
            descricao,
            dataEntrega: new Date(dataEntrega),
            disciplinaId
        }
    });
    return trabalho;
}

export async function listar(usuarioId: string, disciplinaId?: string) {
    const trabalhos = await prisma.trabalho.findMany({
        where: {
            disciplina: {
                usuarioId,
                ...(disciplinaId ? { id: disciplinaId } : {}),
            }
        }
    });
    return trabalhos;
}

export async function editar(usuarioId: string, id: string, titulo: string, descricao: string | undefined, dataEntrega: string | undefined) {
    const trabalho = await prisma.trabalho.findUnique({
        where: { id },
    });

    if (!trabalho){
        throw new Error("Trabalho não encontrado");
    }
    
    await confirmarDonoDaDisciplina(usuarioId, trabalho.disciplinaId);

    const trabalhoAtualizado = await prisma.trabalho.update({
        where: { id },
        data: {
            titulo,
            descricao,
            dataEntrega: dataEntrega ? new Date(dataEntrega) : undefined,
        },
    });
    return trabalhoAtualizado;
}

export async function excluir(usuarioId: string, id: string) {
    const trabalho = await prisma.trabalho.findUnique({
        where: { id },
    });
    
    if (!trabalho){
        throw new Error("Trabalho não encontrado");
    }

    await confirmarDonoDaDisciplina(usuarioId, trabalho.disciplinaId);

    await prisma.trabalho.delete({
        where: { id },
    });
}

export async function concluir(usuarioId: string, id: string) {
    const trabalho = await prisma.trabalho.findUnique({
        where: { id },
    });

    if (!trabalho){
        throw new Error("Trabalho não encontrado");
    }

    await confirmarDonoDaDisciplina(usuarioId, trabalho.disciplinaId);

    const trabalhoConcluido = await prisma.trabalho.update({
        where: { id },
        data: {
            status: "concluido",
        },
    });
    return trabalhoConcluido;
}