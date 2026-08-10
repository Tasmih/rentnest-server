import { Router } from "express";
import { AuthRoutes } from "../services/auth/auth.route";
import auth from "../middleware/auth";
import authorize from "../middleware/authorize";
import { UserRole } from "../generated/prisma/enums";
import { UserRoutes } from "../services/user/user.route";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "RentNest API is healthy",
    data: null,
  });
});

router.get("/protected", auth, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected route accessed successfully",
    data: {
      user: res.locals.user,
    },
  });
});

router.get(
  "/admin-only",
  auth,
  authorize(UserRole.ADMIN),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Admin route accessed successfully",
      data: {
        user: res.locals.user,
      },
    });
  }
);

router.use("/auth", AuthRoutes);
router.use("/users", UserRoutes);

export default router;