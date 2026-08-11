import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes";
import globalErrorHandler from "./middleware/globalErrorHandler";
import notFound from "./middleware/notFound";

const app = express();

// 1. Security HTTP Headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Avoid breaking external image loading (e.g. Google avatars, Unsplash)
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// 2. Production-safe CORS Configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. Mobile apps, Postman/cURL, SSR requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS origin '${origin}' not allowed.`));
      }
    },
    credentials: true,
  })
);

// 3. Body Parsing & Route Registration
app.use(express.json({ limit: "2mb" }));
app.use("/api", routes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "RentNest API is running",
    data: null,
  });
});

app.use(notFound);
app.use(globalErrorHandler);

export default app;