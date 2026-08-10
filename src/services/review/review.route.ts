import { Router } from "express";
import { ReviewController } from "./review.controller";
import auth from "../../middleware/auth";

const router = Router();

// Create Review (Protected)
router.post(
  "/",
  auth,
  ReviewController.createReview
);

// Get Property Reviews (Public)
router.get(
  "/property/:propertyId",
  ReviewController.getPropertyReviews
);

// Update Review (Protected)
router.patch(
  "/:id",
  auth,
  ReviewController.updateReview
);

// Delete Review (Protected)
router.delete(
  "/:id",
  auth,
  ReviewController.deleteReview
);

export const ReviewRoutes = router;
