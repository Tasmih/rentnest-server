import prisma from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { CategoryStatus } from "../../generated/prisma/enums";

type TCreateCategoryPayload = {
  name: string;
  description?: string;
};

type TUpdateCategoryPayload = {
  name?: string;
  description?: string;
  status?: CategoryStatus;
};

// Create Category
const createCategory = async (payload: TCreateCategoryPayload) => {
  const existingCategory = await prisma.category.findUnique({
    where: {
      name: payload.name,
    },
  });

  if (existingCategory) {
    throw new AppError(409, "Category already exists");
  }

  const category = await prisma.category.create({
    data: {
      name: payload.name,
      description: payload.description,
    },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return category;
};

// Get All Categories (Active & Not Deleted)
const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    where: {
      isDeleted: false,
      status: "ACTIVE",
    },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return categories;
};

// Get Category By ID
const getCategoryById = async (id: string) => {
  const category = await prisma.category.findFirst({
    where: {
      id,
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  return category;
};

// Update Category
const updateCategory = async (id: string, payload: TUpdateCategoryPayload) => {
  const category = await prisma.category.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  if (payload.name && payload.name !== category.name) {
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: payload.name,
        id: { not: id },
      },
    });

    if (existingCategory) {
      throw new AppError(409, "Category with this name already exists");
    }
  }

  const updatedCategory = await prisma.category.update({
    where: {
      id,
    },
    data: payload,
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      updatedAt: true,
    },
  });

  return updatedCategory;
};

// Delete Category (Soft Delete)
const deleteCategory = async (id: string) => {
  const category = await prisma.category.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  const activePropertiesCount = await prisma.property.count({
    where: {
      categoryId: id,
      isDeleted: false,
    },
  });

  if (activePropertiesCount > 0) {
    throw new AppError(400, "Cannot delete category with active properties");
  }

  const deletedCategory = await prisma.category.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
      status: "INACTIVE",
    },
    select: {
      id: true,
      name: true,
      status: true,
      isDeleted: true,
    },
  });

  return deletedCategory;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};