import express from "express";
import cors from "cors";
import config from "./config";
import cookieParser from "cookie-parser";
import { userRoutes } from "./modules/user/user.routes";

const app = express();

app.use(
  cors({
    origin: [
      config.app_url,
      "http://localhost:3000",
      "http://localhost:5173",
    ].filter(Boolean),
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/api/users', userRoutes)

export default app;
