import express from "express";
import cors from "cors";
import routes from "./routes";
import globalErrorHandler from "./middleware/globalErrorHandler";
import notFound from "./middleware/notFound";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
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