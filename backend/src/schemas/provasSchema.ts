import { z } from "zod";

export const provaSchema = z.object({
  disciplinaId: z.string().min(1, "Disciplina é obrigatória"),
  nome: z.string().min(1, "Nome é obrigatório"),
  data: z.string().min(1, "Data é obrigatória"),
});