import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "RentNest API is healthy",
    data: null,
  });
});

export default router;