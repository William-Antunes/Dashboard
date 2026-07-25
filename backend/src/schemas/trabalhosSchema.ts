import { z  }   from "zod";

export const trabalhosSchema = z.object({
    disciplinaId: z.string().min(1, "Disciplina é obrigatório"),
    titulo: z.string().min(1, "Título é obrigatório"),
    descricao: z.string().optional(),
    dataEntrega: z.string().min(1, "Data de entrega é obrigatória"),
});