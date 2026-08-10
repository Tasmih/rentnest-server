import prisma from "../../lib/prisma";
import AppError from "../../utils/AppError";

type TCreateReviewPayload = {
  propertyId: string;
  rating: number;
  comment?: string;
};

type TUpdateReviewPayload = {
  rating?: number;
  comment?: string;
};

// Create Review
const createReview = async (
  userId: string,
  payload: TCreateReviewPayload
) => {
  if (!payload.rating || payload.rating < 1 || payload.rating > 5) {
    throw new AppError(400, "Rating must be between 1 and 5");
  }

  const property = await prisma.property.findFirst({
    where: {
      id: payload.propertyId,
      isDeleted: false,
    },
  });

  if (!property) {
    throw new AppError(404, "Property not found");
  }

  const existingReview = await prisma.review.findFirst({
    where: {
      userId,
      propertyId: payload.propertyId,
      isDeleted: false,
    },
  });

  if (existingReview) {
    throw new AppError(409, "You have already reviewed this property");
  }

  const review = await prisma.review.create({
    data: {
      userId,
      propertyId: payload.propertyId,
      rating: payload.rating,
      comment: payload.comment,
      status: "PUBLISHED",
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      userId: true,
      propertyId: true,
      status: true,
      createdAt: true,
    },
  });

  return review;
};

// Get Property Reviews
const getPropertyReviews = async (propertyId: string) => {
  const property = await prisma.property.findFirst({
    where: {
      id: propertyId,
      isDeleted: false,
    },
  });

  if (!property) {
    throw new AppError(404, "Property not found");
  }

  const reviews = await prisma.review.findMany({
    where: {
      propertyId,
      isDeleted: false,
      status: "PUBLISHED",
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reviews;
};

// Update Review
const updateReview = async (
  id: string,
  userId: string,
  payload: TUpdateReviewPayload
) => {
  const review = await prisma.review.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!review) {
    throw new AppError(404, "Review not found");
  }

  if (review.userId !== userId) {
    throw new AppError(403, "You do not have permission to update this review");
  }

  if (payload.rating !== undefined && (payload.rating < 1 || payload.rating > 5)) {
    throw new AppError(400, "Rating must be between 1 and 5");
  }

  const updatedReview = await prisma.review.update({
    where: {
      id,
    },
    data: {
      ...(payload.rating !== undefined && { rating: payload.rating }),
      ...(payload.comment !== undefined && { comment: payload.comment }),
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      status: true,
      updatedAt: true,
    },
  });

  return updatedReview;
};

// Delete Review
const deleteReview = async (id: string, userId: string) => {
  const review = await prisma.review.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!review) {
    throw new AppError(404, "Review not found");
  }

  if (review.userId !== userId) {
    throw new AppError(403, "You do not have permission to delete this review");
  }

  const deletedReview = await prisma.review.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
      status: "HIDDEN",
    },
    select: {
      id: true,
      status: true,
      isDeleted: true,
      updatedAt: true,
    },
  });

  return deletedReview;
};

export const ReviewService = {
  createReview,
  getPropertyReviews,
  updateReview,
  deleteReview,
};
