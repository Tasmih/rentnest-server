import { Router } from "express";
import { AuthRoutes } from "../services/auth/auth.route";
import auth from "../middleware/auth";
import authorize from "../middleware/authorize";
import { UserRole } from "../generated/prisma/enums";
import { UserRoutes } from "../services/user/user.route";
import { CategoryRoutes } from "../services/category/category.route";
import { PropertyRoutes } from "../services/property/property.route";
import { RentalRequestRoutes } from "../services/rentalRequest/rentalRequest.route";
import { FavoriteRoutes } from "../services/favorite/favorite.route";
import { ReviewRoutes } from "../services/review/review.route";
import { DashboardRoutes } from "../services/dashboard/dashboard.route";
import { NotificationRoutes } from "../services/notification/notification.route";


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
router.use("/categories", CategoryRoutes);
router.use("/properties", PropertyRoutes);
router.use("/rental-requests", RentalRequestRoutes);
router.use("/favorites", FavoriteRoutes);
router.use("/reviews", ReviewRoutes);
router.use("/dashboard", DashboardRoutes);
router.use("/notifications", NotificationRoutes);

export default router;