import { Router } from "express";
import * as provascontroller from "../controllers/ProvaController";
import { autenticar } from "../middleware/AuthMiddleware";
import { validar } from "../middleware/validacaoMiddleware";
import { provaSchema } from "../schemas/provasSchema";


const router = Router();

router.post("/", autenticar,validar(provaSchema), provascontroller.criar);
router.get("/", autenticar, provascontroller.listar);
router.put("/:id", autenticar, validar(provaSchema), provascontroller.editar);
router.delete("/:id", autenticar, provascontroller.excluir);

export default router;