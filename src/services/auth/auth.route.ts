import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authLimiter } from "../../middleware/rateLimiter";

const router = Router();

router.post("/register", authLimiter, AuthController.registerUser);
router.post("/login", authLimiter, AuthController.loginUser);
router.post("/google", authLimiter, AuthController.googleLogin);
router.post("/google/complete", authLimiter, AuthController.completeGoogleSignup);

export const AuthRoutes = router;