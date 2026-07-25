import { Router } from "express";
import * as authController from "../controllers/AuthController";
import { validar } from "../middleware/validacaoMiddleware";
import { registrarSchema, loginSchema } from "../schemas/authSchema";
import { autenticar } from "../middleware/AuthMiddleware";


const router = Router();
router.get("/me", autenticar, authController.me);
router.post("/registrar", validar(registrarSchema), authController.register);
router.post("/login", validar(loginSchema), authController.login);

export default router;