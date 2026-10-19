import jwt from "jsonwebtoken";

export const generateAccessToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign({ sub: userId }, secret, { expiresIn: "15m" });
};
