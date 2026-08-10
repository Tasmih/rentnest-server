import prisma from "../../lib/prisma";
import AppError from "../../utils/AppError";

// Add Favorite
const addFavorite = async (userId: string, propertyId: string) => {
  const property = await prisma.property.findFirst({
    where: {
      id: propertyId,
      isDeleted: false,
    },
  });

  if (!property) {
    throw new AppError(404, "Property not found");
  }

  const existingFavorite = await prisma.favorite.findUnique({
    where: {
      userId_propertyId: {
        userId,
        propertyId,
      },
    },
  });

  if (existingFavorite) {
    if (!existingFavorite.isDeleted && existingFavorite.status === "ACTIVE") {
      throw new AppError(409, "Property is already in favorites");
    }

    const reactivatedFavorite = await prisma.favorite.update({
      where: {
        id: existingFavorite.id,
      },
      data: {
        isDeleted: false,
        status: "ACTIVE",
      },
      select: {
        id: true,
        userId: true,
        propertyId: true,
        status: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return reactivatedFavorite;
  }

  const favorite = await prisma.favorite.create({
    data: {
      userId,
      propertyId,
      status: "ACTIVE",
    },
    select: {
      id: true,
      userId: true,
      propertyId: true,
      status: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return favorite;
};

// Remove Favorite
const removeFavorite = async (userId: string, propertyId: string) => {
  const favorite = await prisma.favorite.findFirst({
    where: {
      userId,
      propertyId,
      isDeleted: false,
    },
  });

  if (!favorite) {
    throw new AppError(404, "Favorite not found");
  }

  const updatedFavorite = await prisma.favorite.update({
    where: {
      id: favorite.id,
    },
    data: {
      isDeleted: true,
      status: "REMOVED",
    },
    select: {
      id: true,
      userId: true,
      propertyId: true,
      status: true,
      isDeleted: true,
      updatedAt: true,
    },
  });

  return updatedFavorite;
};

// Get My Favorites
const getMyFavorites = async (userId: string) => {
  const favorites = await prisma.favorite.findMany({
    where: {
      userId,
      isDeleted: false,
      status: "ACTIVE",
    },
    select: {
      id: true,
      createdAt: true,
      property: {
        select: {
          id: true,
          title: true,
          rent: true,
          area: true,
          address: true,
          coverImage: true,
          category: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return favorites;
};

export const FavoriteService = {
  addFavorite,
  removeFavorite,
  getMyFavorites,
};
