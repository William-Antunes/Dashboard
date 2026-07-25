import { Router } from "express";
import * as disciplinasController from "../controllers/DisciplinasController";
import { autenticar } from "../middleware/AuthMiddleware";
import { validar } from "../middleware/validacaoMiddleware";
import { disciplinasSchema } from "../schemas/disciplinasSchema";


const router = Router();

router.post("/", autenticar,validar(disciplinasSchema), disciplinasController.criar);
router.get("/", autenticar, disciplinasController.listar);
router.put("/:id", autenticar,validar(disciplinasSchema), disciplinasController.editar);
router.delete("/:id", autenticar, disciplinasController.excluir);

export default router;