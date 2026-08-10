import { Router } from "express";
import { CategoryController } from "./category.controller";
import auth from "../../middleware/auth";
import authorize from "../../middleware/authorize";
import { UserRole } from "../../generated/prisma/enums";


const router = Router();


router.post(
  "/",
  auth,
  authorize(UserRole.ADMIN),
  CategoryController.createCategory
);


router.get(
  "/",
  auth,
  CategoryController.getAllCategories
);


export const CategoryRoutes = router;