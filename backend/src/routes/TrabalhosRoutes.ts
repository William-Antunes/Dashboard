import { Router } from "express";
import * as trabalhosController from "../controllers/TrabalhosController";
import { autenticar } from "../middleware/AuthMiddleware";
import { validar } from "../middleware/validacaoMiddleware";
import { trabalhosSchema } from "../schemas/trabalhosSchema";


const router = Router();

router.post("/", autenticar,validar(trabalhosSchema), trabalhosController.criar);
router.get("/", autenticar, trabalhosController.listar);
router.put("/:id", autenticar, validar(trabalhosSchema), trabalhosController.editar);
router.delete("/:id", autenticar, trabalhosController.excluir);
router.patch("/:id/concluir", autenticar, trabalhosController.concluir);

export default router;