import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import mini = require('zod/v4/mini');

const prisma = new PrismaClient()

export async function createUser(email: string, password: string) {
    const usuarioExistente = await prisma.usuario.findUnique({ where: {email}, })


    if (usuarioExistente) 
        throw new Error("Email já está em uso.")

    const senhaHash = await bcrypt.hash(senha, 10)
    
    const usuario = await prisma.usuario.create({
        data: {
            nome,
            email,
            senhaHash,
        },
    })
    return {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
    }
}

export async function login(email: string, senha: string) {
    const usuario = await prisma.usuario.findUnique({where: { email },})
    if(!usuario)
        throw new Error("Email ou senha inválidos.")

    const senhaCorreta = await bcrypt.compare(senha, usuario.senhaHash)

    if(!senhaCorreta)
        throw new Error("Email ou senha inválidos")

    const token = mini.jwt.sign(
        {id: usuario.id},
        process.env.JWT_SECRET as string,
        {expiresIn: "7d"}
    )

}