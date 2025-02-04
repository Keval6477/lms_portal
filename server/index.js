import express from "express";
import dotenv from "dotenv";
dotenv.config();
import helmet from "helmet";
import cors from "cors";
import connectDb from "./database/db.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.route.js";
import courseRoutes from "./routes/course.route.js";
import mediaUploadRoutes from "./routes/media.route.js";
//call db
connectDb();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(helmet());
app.use("/api/v1/media", mediaUploadRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/course", courseRoutes);
app.get("/home", (_, res) => {
  return res.status(200).json({
    success: true,
    message: "done",
  });
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("server is listening on port=>" + PORT);
});
