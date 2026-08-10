import { Router } from "express";
import { FavoriteController } from "./favorite.controller";
import auth from "../../middleware/auth";

const router = Router();

// Add Favorite
router.post(
  "/:propertyId",
  auth,
  FavoriteController.addFavorite
);

// Get My Favorites
router.get(
  "/my",
  auth,
  FavoriteController.getMyFavorites
);

// Remove Favorite
router.delete(
  "/:propertyId",
  auth,
  FavoriteController.removeFavorite
);

export const FavoriteRoutes = router;
