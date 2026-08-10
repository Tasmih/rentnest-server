import { Router } from "express";
import { UserController } from "./user.controller";
import auth from "../../middleware/auth";
import authorize from "../../middleware/authorize";
import { UserRole } from "../../generated/prisma/enums";

const router = Router();

router.get(
  "/",
  auth,
  authorize(UserRole.ADMIN),
  UserController.getAllUsers
);

router.get(
  "/:id",
  auth,
  authorize(UserRole.ADMIN),
  UserController.getUserById
);

router.patch(
  "/:id",
  auth,
  authorize(UserRole.ADMIN),
  UserController.updateUser
);


//delete
router.delete(
  "/:id",
  auth,
  authorize(UserRole.ADMIN),
  UserController.deleteUser
);



export const UserRoutes = router;