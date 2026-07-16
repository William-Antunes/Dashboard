import { Response} from 'express';
import * as disciplinasService from '../services/disciplinas-service';
import { RequestComUsuario } from '../middleware/AuthMiddleware';

export async function criar(req: RequestComUsuario, res: Response) {
    try {
        const { nome, professor, cor, periodo } = req.body
        const usuarioId = req.usuarioId as string
        const disciplina = await disciplinasService.criar(usuarioId, nome, professor, cor, periodo)
        res.status(201).json(disciplina)
    }catch(error: any){
        res.status(400).json({ error: error.message })
    }
}

export async function listar(req: RequestComUsuario, res: Response) {
    try {
        const usuarioId = req.usuarioId as string
        const disciplinas = await disciplinasService.listar(usuarioId)
        res.status(200).json(disciplinas)
    }catch(error: any){
        res.status(400).json({ error: error.message })
    }
}

export async function editar(req: RequestComUsuario, res: Response) {
    try {
        const { id } = req.params
        const { nome, professor, cor, periodo } = req.body
        const usuarioId = req.usuarioId as string
        const disciplinaAtualizada = await disciplinasService.editar(usuarioId, id, nome, professor, cor, periodo)
        res.status(200).json(disciplinaAtualizada)
    }catch(error: any){
        res.status(400).json({ error: error.message })
    }
}

export async function excluir(req: RequestComUsuario, res: Response) {
    try {
        const { id } = req.params
        const usuarioId = req.usuarioId as string
        await disciplinasService.excluir(usuarioId, id)
        res.status(204).send()
    }catch(error: any){
        res.status(400).json({ error: error.message })
    }
}