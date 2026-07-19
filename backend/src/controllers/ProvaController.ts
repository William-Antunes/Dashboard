import { Response} from 'express';
import * as ProvaService from '../services/provas-service';
import { RequestComUsuario } from '../middleware/AuthMiddleware';

export async function criar(req: RequestComUsuario, res: Response) {
    try {
        const { disciplinaId, titulo, descricao, data } = req.body
        const usuarioId = req.usuarioId as string
        const prova = await ProvaService.criar(usuarioId, disciplinaId, titulo, descricao, data)
        res.status(201).json(prova)
    }catch(error: any){
        res.status(400).json({ error: error.message })
    }
}

export async function listar(req: RequestComUsuario, res: Response) {
    try {
        const { disciplinaId } = req.query
        const usuarioId = req.usuarioId as string
        const provas = await ProvaService.listar(usuarioId, disciplinaId as string | undefined)
        res.status(200).json(provas)
    }catch(error: any){
        res.status(400).json({ error: error.message })
    }
}

export async function editar(req: RequestComUsuario, res: Response) {
    try {
        const { id } = req.params
        const { titulo, descricao, data } = req.body
        const usuarioId = req.usuarioId as string
        const provaAtualizada = await ProvaService.editar(usuarioId, id, titulo, descricao, data)
        res.status(200).json(provaAtualizada)
    }catch(error: any){
        res.status(400).json({ error: error.message })
    }
}

export async function excluir(req: RequestComUsuario, res: Response) {
    try {
        const { id } = req.params
        const usuarioId = req.usuarioId as string
        await ProvaService.excluir(usuarioId, id)
        res.status(204).send()
    }catch(error: any){
        res.status(400).json({ error: error.message })
    }
}
