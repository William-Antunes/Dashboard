import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

interface RequestComUsuario extends Request {
    usuarioId?: string
}


export function autenticar(req: RequestComUsuario, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).json({ error: "Token não fornecido" })
    }

    const token = authHeader.split(" ")[1]
    if (!token) {
        return res.status(401).json({ error: "Token mal formatado" })
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string }
    
    req.usuarioId = payload.id
    next()
    }
    catch (err) {
        return res.status(401).json({ error: "Token inválido" })    
    }

}