import { Router } from "express";
import { NotificationController } from "./notification.controller";
import auth from "../../middleware/auth";

const router = Router();

// GET /api/notifications
router.get(
  "/",
  auth,
  NotificationController.getUserNotifications
);

// PATCH /api/notifications/read-all
router.patch(
  "/read-all",
  auth,
  NotificationController.markAllAsRead
);

// PATCH /api/notifications/:id/read
router.patch(
  "/:id/read",
  auth,
  NotificationController.markAsRead
);

// DELETE /api/notifications/:id
router.delete(
  "/:id",
  auth,
  NotificationController.deleteNotification
);

export const NotificationRoutes = router;
