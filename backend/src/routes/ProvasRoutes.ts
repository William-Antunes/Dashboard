import { Router } from "express";
import * as provascontroller from "../controllers/ProvaController";
import { autenticar } from "../middleware/AuthMiddleware";
import { validar } from "../middleware/validacaoMiddleware";
import { provasSchema } from "../schemas/provasSchema";


const router = Router();

router.post("/", autenticar,validar(provasSchema), provascontroller.criar);
router.get("/", autenticar, provascontroller.listar);
router.put("/:id", autenticar, validar(provasSchema), provascontroller.editar);
router.delete("/:id", autenticar, provascontroller.excluir);

export default router;