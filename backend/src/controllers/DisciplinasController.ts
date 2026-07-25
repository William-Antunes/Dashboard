import { Response } from "express";
import * as disciplinasService from "../services/disciplinas-service";
import { RequestComUsuario } from "../middleware/AuthMiddleware";

export async function criar(req: RequestComUsuario, res: Response) {
  try {
    const { nome, professor, cor, periodo, horarios } = req.body;
    const usuarioId = req.usuarioId as string;

    const disciplina = await disciplinasService.criar(
      usuarioId,
      nome,
      professor,
      cor,
      periodo,
      horarios
    );

    res.status(201).json(disciplina);
  } catch (erro: any) {
    res.status(400).json({ mensagem: erro.message });
  }
}

export async function listar(req: RequestComUsuario, res: Response) {
  try {
    const usuarioId = req.usuarioId as string;

    const disciplinas = await disciplinasService.listar(usuarioId);

    res.status(200).json(disciplinas);
  } catch (erro: any) {
    res.status(400).json({ mensagem: erro.message });
  }
}

export async function editar(req: RequestComUsuario, res: Response) {
  try {
    const { id } = req.params;
    const { nome, professor, cor, periodo, horarios } = req.body;
    const usuarioId = req.usuarioId as string;

    const disciplina = await disciplinasService.editar(
      usuarioId,
      id,
      nome,
      professor,
      cor,
      periodo,
      horarios
    );

    res.status(200).json(disciplina);
  } catch (erro: any) {
    res.status(403).json({ mensagem: erro.message });
  }
}

export async function excluir(req: RequestComUsuario, res: Response) {
  try {
    const { id } = req.params;
    const usuarioId = req.usuarioId as string;

    await disciplinasService.excluir(usuarioId, id);

    res.status(204).send();
  } catch (erro: any) {
    res.status(403).json({ mensagem: erro.message });
  }
}