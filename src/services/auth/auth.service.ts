import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import prisma from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { UserRole } from "../../generated/prisma/enums";
import { JwtUtils } from "../../utils/jwt";

const googleClient = new OAuth2Client();

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

type TGoogleAuthPayload = {
  credential?: string;
  idToken?: string;
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

  if (payload.role === UserRole.ADMIN) {
    throw new AppError(
      403,
      "Admin account cannot be created through public registration"
    );
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

  if (!user.password) {
    throw new AppError(
      400,
      "This account was created via social login. Please log in using Google."
    );
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
      avatarUrl: user.avatarUrl,
    },
  };
};

const googleLogin = async (payload: TGoogleAuthPayload) => {
  const tokenToVerify = payload.credential || payload.idToken;

  if (!tokenToVerify) {
    throw new AppError(400, "Google credential or ID token is required");
  }

  let ticket;
  try {
    ticket = await googleClient.verifyIdToken({
      idToken: tokenToVerify,
    });
  } catch (error) {
    throw new AppError(401, "Invalid or expired Google credential token");
  }

  const googlePayload = ticket.getPayload();
  if (!googlePayload || !googlePayload.email) {
    throw new AppError(400, "Unable to extract user profile from Google token");
  }

  const { email, name, picture, sub: googleId } = googlePayload;

  // Check if user exists by email or googleId
  let user = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { googleId }],
    },
  });

  if (user) {
    if (user.isDeleted) {
      throw new AppError(401, "User account is deleted");
    }
    if (user.status !== "ACTIVE") {
      throw new AppError(403, "Your account is not active");
    }

    // Update googleId/avatarUrl if missing
    if (!user.googleId || !user.avatarUrl) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: user.googleId || googleId,
          avatarUrl: user.avatarUrl || picture,
          provider: user.provider || "GOOGLE",
        },
      });
    }
  } else {
    // Create new Google user
    user = await prisma.user.create({
      data: {
        name: name || "Google User",
        email,
        googleId,
        avatarUrl: picture,
        provider: "GOOGLE",
        role: UserRole.TENANT,
        status: "ACTIVE",
      },
    });
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
      avatarUrl: user.avatarUrl,
    },
  };
};

export const AuthService = {
  registerUser,
  loginUser,
  googleLogin,
};