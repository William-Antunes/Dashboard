import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validar(schema: ZodSchema) {
    return(req: Request, res: Response, next: NextFunction) => {
        const resultado = schema.safeParse(req.body);
        if (!resultado.success) {
            const erros = resultado.error.issues.map((erro) => erro.message);
            return res.status(400).json({mensagem: erros.join(', ')});
            
        }
        req.body = resultado.data;
        next();
    }
}