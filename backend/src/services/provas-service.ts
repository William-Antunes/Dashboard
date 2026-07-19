import dotenv from "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client";
import { Pool } from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaPg } from '@prisma/adapter-pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function confirmarDonoDaDisciplina(usuarioId: string, disciplinaId: string) {
    const disciplina = await prisma.disciplina.findUnique({
        where: { id: disciplinaId },
    });

    if (!disciplina) {
        throw new Error("Disciplina não foi encontrada")
    }

    if(disciplina.usuarioId !== usuarioId){
        throw new Error("Você não tem permissão de mexer com essa disciplina")
    }
}

export async function criar(usuarioId:string, disciplinaId: string, titulo: string, descricao: string, data: string){
    await confirmarDonoDaDisciplina(usuarioId, disciplinaId)

    const prova = await prisma.prova.create({
        data: 
        {
            titulo,
            descricao,
            data:new Date(data),
            disciplinaId
        },
    })
    return prova
}

export async function listar(usuarioId: string, disciplinaId?: string){
    const provas = prisma.prova.findMany({
        where: {
            disciplina: {
                usuarioId,
                ...(disciplinaId ? { id: disciplinaId } : {}),
            }
        }
    })
    return provas
}

export async function editar(usuarioId: string, id: string, titulo: string, descricao: string, data: string){
    const prova = await prisma.prova.findUnique({
        where: {
            id
        },
    })

    if(!prova){
        throw new Error("Prova não encontrada")
    }

    await confirmarDonoDaDisciplina(usuarioId, prova.disciplinaId)

    const provaAtualizada = await prisma.prova.update({
        where: {
            id
        },
        data: {
            titulo,
            descricao,
            data: new Date(data)
        }
    })
    return provaAtualizada
}

export async function excluir(usuarioId: string, id: string){
    const prova = await prisma.prova.findUnique({
        where: {
            id
        },
    })

    if(!prova){
        throw new Error("Prova não encontrada")
    }

    await confirmarDonoDaDisciplina(usuarioId, prova.disciplinaId)

    await prisma.prova.delete({
        where: {
            id
        }
    })
    
}