import bcrypt from "bcrypt";
import prisma from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { UserRole } from "../../generated/prisma/enums";
import { JwtUtils } from "../../utils/jwt";

type TRegisterPayload = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
};

type TLoginPayload = {
  email: string;
  password: string;
};

const registerUser = async (payload: TRegisterPayload) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (existingUser) {
    throw new AppError(409, "User already exists with this email");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 12);

  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      phone: payload.phone,
      role: payload.role ?? UserRole.TENANT,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  return user;
};

const loginUser = async (payload: TLoginPayload) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!user || user.isDeleted) {
    throw new AppError(401, "Invalid email or password");
  }

  if (user.status !== "ACTIVE") {
    throw new AppError(403, "Your account is not active");
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user.password
  );

  if (!isPasswordMatched) {
    throw new AppError(401, "Invalid email or password");
  }

  const token = JwtUtils.createToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
    },
  };
};

export const AuthService = {
  registerUser,
  loginUser,
};