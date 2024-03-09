import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import httpStatus from "http-status";
import config from "./config";
import cookieParser from "cookie-parser";
import { routes } from "./routes";
import { globalErrorhandler } from "./middleware/globalErrorHandler";
import Cloudinary from "./cloudinary/cloudinary.config";

const app: Application = express();

app.use(express.json({ limit: "50mb" }));

app.use(cookieParser());

app.use(
  cors({
    // origin: ["https://edu-sphere-frontend.vercel.app", "http://localhost:3000"],
    origin: "https://edu-sphere-frontend.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
  })
);


// app.options("*", cors());

app.use(express.urlencoded({ extended: true }));

Cloudinary();

app.use("/api/v1", routes);

app.get("/", (req: Request, res: Response) => {
  res.send(`EduSphere Server Running On PORT ${config.port}`);
});

// middleware
app.use(globalErrorhandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API Not Found",
      },
    ],
  });
  next();
});

export default app;