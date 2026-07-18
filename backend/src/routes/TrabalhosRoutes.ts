import { Router } from "express";
import * as trabalhosController from "../controllers/TrabalhosController";
import { autenticar } from "../middleware/AuthMiddleware";

const router = Router();

router.post("/", autenticar, trabalhosController.criar);
router.get("/", autenticar, trabalhosController.listar);
router.put("/:id", autenticar, trabalhosController.editar);
router.delete("/:id", autenticar, trabalhosController.excluir);
router.patch("/:id/concluir", autenticar, trabalhosController.concluir);

export default router;