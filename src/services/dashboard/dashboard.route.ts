import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import auth from "../../middleware/auth";
import authorize from "../../middleware/authorize";
import { UserRole } from "../../generated/prisma/enums";

const router = Router();

// Admin Dashboard
router.get(
  "/admin",
  auth,
  authorize(UserRole.ADMIN),
  DashboardController.adminDashboard
);

// Landlord Dashboard
router.get(
  "/landlord",
  auth,
  authorize(UserRole.LANDLORD, UserRole.ADMIN),
  DashboardController.landlordDashboard
);

// Tenant Dashboard
router.get(
  "/tenant",
  auth,
  authorize(UserRole.TENANT, UserRole.ADMIN),
  DashboardController.tenantDashboard
);

export const DashboardRoutes = router;
