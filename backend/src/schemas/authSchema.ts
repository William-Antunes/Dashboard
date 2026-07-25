import { z } from "zod";

export const registrarSchema = z.object({
    nome: z.string().min(1, "Nome é ogrigatório"),
    email: z.string().email("Email inválido"),
    senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
})

export const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    senha: z.string().min(1, "Senha é obrigatória"),
})