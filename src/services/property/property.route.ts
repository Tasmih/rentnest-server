import { Router } from "express";
import { PropertyController } from "./property.controller";
import auth from "../../middleware/auth";
import authorize from "../../middleware/authorize";
import { UserRole } from "../../generated/prisma/enums";

const router = Router();


router.post(
  "/",
  auth,
  authorize(UserRole.LANDLORD, UserRole.ADMIN),
  PropertyController.createProperty
);


router.get(
  "/",
  auth,
  PropertyController.getAllProperties
);


router.get(
  "/:id",
  auth,
  PropertyController.getPropertyById
);

//update
router.patch(
  "/:id",
  auth,
  authorize(UserRole.LANDLORD, UserRole.ADMIN),
  PropertyController.updateProperty
);


router.delete(
  "/:id",
  auth,
  authorize(UserRole.LANDLORD, UserRole.ADMIN),
  PropertyController.deleteProperty
);


export const PropertyRoutes = router;