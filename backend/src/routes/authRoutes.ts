import { Router } from "express";
import * as authController from "../controllers/AuthController";

const router = Router();

router.post("/registrar", authController.register);
router.post("/login", authController.login);

export default router;