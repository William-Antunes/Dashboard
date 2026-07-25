import { z } from "zod";

export const disciplinasSchema = z.object({
    nome: z.string().min(1, "Nome é obrigatório"),
    professor: z.string().optional(),
    cor: z.string().optional(),
    periodo: z.string().optional(),
});