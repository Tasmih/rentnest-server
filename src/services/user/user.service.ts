import prisma from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { UserRole, UserStatus } from "../../generated/prisma/enums";

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    where: {
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
};

const getUserById = async (id: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id,
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return user;
};

type TUpdateUserPayload = {
  name?: string;
  email?: string;
  phone?: string;
  role?: UserRole;
  status?: UserStatus;
};

const updateUser = async (
  id: string,
  payload: TUpdateUserPayload
) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!existingUser) {
    throw new AppError(404, "User not found");
  }

  if (payload.email && payload.email !== existingUser.email) {
    const emailExists = await prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (emailExists) {
      throw new AppError(409, "User already exists with this email");
    }
  }

  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};


// delete user

const deleteUser = async (id: string) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!existingUser) {
    throw new AppError(404, "User not found");
  }

  const deletedUser = await prisma.user.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
      status: UserStatus.INACTIVE,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      isDeleted: true,
    },
  });

  return deletedUser;
};

export const UserService = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};