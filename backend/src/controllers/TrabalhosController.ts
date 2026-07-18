import { Response} from 'express';
import * as trabalhosService from '../services/trabalho-service';
import { RequestComUsuario } from '../middleware/AuthMiddleware';

export async function criar(req: RequestComUsuario, res: Response) {
    try {
        const { disciplinaId, titulo, descricao, dataEntrega } = req.body
        const usuarioId = req.usuarioId as string
        const trabalho = await trabalhosService.criar(usuarioId, disciplinaId, titulo, descricao, dataEntrega)
        res.status(201).json(trabalho)
    }catch(error: any){
        res.status(400).json({ error: error.message })
    }
}

export async function listar(req: RequestComUsuario, res: Response) {
    try {
        const { disciplinaId } = req.query
        const usuarioId = req.usuarioId as string
        const trabalhos = await trabalhosService.listar(usuarioId, disciplinaId as string | undefined)
        res.status(200).json(trabalhos)
    }catch(error: any){
        res.status(400).json({ error: error.message })
    }
}

export async function editar(req: RequestComUsuario, res: Response) {
    try {
        const { id } = req.params
        const { titulo, descricao, dataEntrega } = req.body
        const usuarioId = req.usuarioId as string
        const trabalhoAtualizado = await trabalhosService.editar(usuarioId, id, titulo, descricao, dataEntrega)
        res.status(200).json(trabalhoAtualizado)
    }catch(error: any){
        res.status(400).json({ error: error.message })
    }
}

export async function excluir(req: RequestComUsuario, res: Response) {
    try {
        const { id } = req.params
        const usuarioId = req.usuarioId as string
        await trabalhosService.excluir(usuarioId, id)
        res.status(204).send()
    }catch(error: any){
        res.status(400).json({ error: error.message })
    }
}

export async function concluir(req: RequestComUsuario, res: Response) {
    try {
        const { id } = req.params
        const usuarioId = req.usuarioId as string
        await trabalhosService.concluir(usuarioId, id)
        res.status(200).json({ message: "Trabalho concluído com sucesso" })
    }catch(error: any){
        res.status(400).json({ error: error.message })
    }
}