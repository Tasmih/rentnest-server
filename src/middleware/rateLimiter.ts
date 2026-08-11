import rateLimit from "express-rate-limit";

/**
 * Strict rate limiter for sensitive authentication endpoints
 * (Login, Register, Google OAuth) to prevent brute-force attacks.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per IP per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login/registration attempts. Please try again after 15 minutes.",
    data: null,
  },
});
