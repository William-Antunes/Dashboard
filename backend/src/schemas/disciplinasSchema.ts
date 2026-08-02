import { z } from "zod";

export const horarioSchema = z.object({
  diaSemana: z.number().min(2, "Dia inválido").max(7, "Dia inválido"),
  turno: z.enum(["M", "T", "N"], { message: "Turno inválido" }),
  slotInicio: z.number().min(1).max(5),
  slotFim: z.number().min(1).max(5),
});

export const disciplinaComHorariosSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  professor: z.string().optional(),
  cor: z.string().optional(),
  periodo: z.string().optional(),
  horarios: z.array(horarioSchema).optional(),
});

export const concluirDisciplina = z.object({
  notaFinal: z.number().min(0, "Nota invalida").max(10, "Nota invalida"),
  cargaHoraria: z.number().int().positive("Carga horaria invalida")
})