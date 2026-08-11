import prisma from "../../lib/prisma";
import AppError from "../../utils/AppError";

type TCreateNotificationPayload = {
  userId: string;
  title: string;
  message: string;
  type?: string;
};

// Create Internal Notification
const createNotification = async (payload: TCreateNotificationPayload) => {
  return prisma.notification.create({
    data: {
      userId: payload.userId,
      title: payload.title,
      message: payload.message,
      type: payload.type || "INFO",
    },
  });
};

// Get User Notifications (GET /api/notifications)
const getUserNotifications = async (userId: string) => {
  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: {
        userId,
        isDeleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        message: true,
        type: true,
        isRead: true,
        createdAt: true,
      },
    }),
    prisma.notification.count({
      where: {
        userId,
        isRead: false,
        isDeleted: false,
      },
    }),
  ]);

  return {
    notifications,
    unreadCount,
  };
};

// Mark Single Notification as Read (PATCH /api/notifications/:id/read)
const markAsRead = async (id: string, userId: string) => {
  const notification = await prisma.notification.findFirst({
    where: {
      id,
      userId,
      isDeleted: false,
    },
  });

  if (!notification) {
    throw new AppError(404, "Notification not found");
  }

  const updated = await prisma.notification.update({
    where: { id },
    data: { isRead: true },
    select: {
      id: true,
      title: true,
      message: true,
      type: true,
      isRead: true,
      createdAt: true,
    },
  });

  return updated;
};

// Mark All Notifications as Read (PATCH /api/notifications/read-all)
const markAllAsRead = async (userId: string) => {
  await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
      isDeleted: false,
    },
    data: {
      isRead: true,
    },
  });

  return { message: "All notifications marked as read" };
};

// Delete Notification (DELETE /api/notifications/:id)
const deleteNotification = async (id: string, userId: string) => {
  const notification = await prisma.notification.findFirst({
    where: {
      id,
      userId,
      isDeleted: false,
    },
  });

  if (!notification) {
    throw new AppError(404, "Notification not found");
  }

  await prisma.notification.update({
    where: { id },
    data: { isDeleted: true },
  });

  return { message: "Notification deleted successfully" };
};

export const NotificationService = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
