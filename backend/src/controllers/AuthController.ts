import { Request, Response } from "express"
import * as authService from "../services/auth-service"

export async function register(req: Request, res: Response) {
    try {
        const { nome, email, senha } = req.body

        const usuario = await authService.registrar(nome, email, senha)
        res.status(201).json(usuario)
    } catch (error: any) {
        res.status(409).json({ error: error.message })
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, senha } = req.body
        const resultado = await authService.login(email, senha)
        res.status(200).json(resultado)
    }catch(error: any){
        res.status(401).json({ error: error.message })
    }
}