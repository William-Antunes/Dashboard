import { Router } from "express";
import * as disciplinasController from "../controllers/DisciplinasController";
import { autenticar } from "../middleware/AuthMiddleware";

const router = Router();

router.post("/", autenticar, disciplinasController.criar);
router.get("/", autenticar, disciplinasController.listar);
router.put("/:id", autenticar, disciplinasController.editar);
router.delete("/:id", autenticar, disciplinasController.excluir);

export default router;