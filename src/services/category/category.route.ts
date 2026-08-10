import { Router } from "express";
import { CategoryController } from "./category.controller";
import auth from "../../middleware/auth";
import authorize from "../../middleware/authorize";
import { UserRole } from "../../generated/prisma/enums";

const router = Router();

// Create Category (ADMIN)
router.post(
  "/",
  auth,
  authorize(UserRole.ADMIN),
  CategoryController.createCategory
);

// Get All Categories
router.get(
  "/",
  CategoryController.getAllCategories
);

// Get Category By ID
router.get(
  "/:id",
  CategoryController.getCategoryById
);

// Update Category (ADMIN)
router.patch(
  "/:id",
  auth,
  authorize(UserRole.ADMIN),
  CategoryController.updateCategory
);

// Delete Category (ADMIN)
router.delete(
  "/:id",
  auth,
  authorize(UserRole.ADMIN),
  CategoryController.deleteCategory
);

export const CategoryRoutes = router;