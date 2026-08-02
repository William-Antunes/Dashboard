import { Response } from "express";
import * as disciplinasService from "../services/disciplinas-service";
import { RequestComUsuario } from "../middleware/AuthMiddleware";

export async function criar(req: RequestComUsuario, res: Response) {
  try {
    const { nome, professor, cor, periodo, cargaHoraria, horarios } = req.body;
    const usuarioId = req.usuarioId as string;

    const disciplina = await disciplinasService.criar(
      usuarioId,
      nome,
      professor,
      cor,
      periodo,
      cargaHoraria,
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

    const status = req.query.status as string | undefined
    const disciplinas = await disciplinasService.listar(usuarioId, status);

    res.status(200).json(disciplinas);
  } catch (erro: any) {
    res.status(400).json({ mensagem: erro.message });
  }
}

export async function editar(req: RequestComUsuario, res: Response) {
  try {
    const { id } = req.params;
    const { nome, professor, cor, periodo, cargaHoraria, horarios } = req.body;
    const usuarioId = req.usuarioId as string;

    const disciplina = await disciplinasService.editar(
      usuarioId,
      id,
      nome,
      professor,
      cor,
      periodo,
      cargaHoraria,
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

export async function concluir(req: RequestComUsuario, res: Response){
  try{
    const {id} = req.params
    const {notaFinal} = req.body
    const usuarioId = req.usuarioId as string

    const disciplina = await disciplinasService.concluir(
      usuarioId,
      id,
      notaFinal
    )
    res.status(200).json(disciplina)
  }catch(error: any){
    res.status(403).json({mensagem: error.message})
  }
}

export async function registrarFalta(req: RequestComUsuario, res: Response){
  try{
    const {id} = req.params
    const {delta} = req.body
    const usuarioId = req.usuarioId as string

    const disciplina = await disciplinasService.registrarFalta(
      usuarioId,
      id,
      delta
    )
    res.status(200).json(disciplina)
  }catch(error: any){
    res.status(403).json({mensagem: error.message})
  }
}