import { Router } from "express";
import * as provascontroller from "../controllers/ProvaController";
import { autenticar } from "../middleware/AuthMiddleware";

const router = Router();

router.post("/", autenticar, provascontroller.criar);
router.get("/", autenticar, provascontroller.listar);
router.put("/:id", autenticar, provascontroller.editar);
router.delete("/:id", autenticar, provascontroller.excluir);

export default router;