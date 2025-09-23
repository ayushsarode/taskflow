import express from "express";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./middlewares/errorHandler.js";
import authRouter from "./modules/auth/controllers/auth.router.js";
import projectRouter from "./modules/projects/controllers/project.router.js";
import taskRouter from "./modules/tasks/controllers/task.router.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/projects", projectRouter);
app.use("/api/tasks", taskRouter);

app.use(errorHandler);

export default app;


