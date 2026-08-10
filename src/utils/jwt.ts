import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

type TJwtPayload = {
  id: string;
  email: string;
  role: string;
};

const createToken = (payload: TJwtPayload) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, secret, options);
};

const verifyToken = (token: string) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.verify(token, secret) as JwtPayload & TJwtPayload;
};

export const JwtUtils = {
  createToken,
  verifyToken,
};