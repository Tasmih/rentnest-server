import { Router } from "express";
import { RentalRequestController } from "./rentalRequest.controller";
import auth from "../../middleware/auth";
import authorize from "../../middleware/authorize";
import { UserRole } from "../../generated/prisma/enums";


const router = Router();


// Tenant create rental request

router.post(
  "/",
  auth,
  RentalRequestController.createRentalRequest
);



// Tenant get own requests

router.get(
  "/my",
  auth,
  RentalRequestController.getMyRentalRequests
);



// Landlord get rental requests

router.get(
  "/landlord",
  auth,
  authorize(UserRole.LANDLORD, UserRole.ADMIN),
  RentalRequestController.getLandlordRentalRequests
);



// Accept rental request

router.patch(
  "/:id/accept",
  auth,
  authorize(UserRole.LANDLORD, UserRole.ADMIN),
  RentalRequestController.acceptRentalRequest
);



// Reject rental request

router.patch(
  "/:id/reject",
  auth,
  authorize(UserRole.LANDLORD, UserRole.ADMIN),
  RentalRequestController.rejectRentalRequest
);



export const RentalRequestRoutes = router;