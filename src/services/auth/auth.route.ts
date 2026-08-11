import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginUser);
router.post("/google", AuthController.googleLogin);
router.post("/google/complete", AuthController.completeGoogleSignup);

export const AuthRoutes = router;