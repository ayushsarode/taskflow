import { Router } from "express";
import { requireAuth } from "../../auth/services/auth.controller.js";
import { createTaskHandler, deleteTaskHandler, listTasksByProjectHandler, updateTaskHandler } from "../services/task.controller.js";

const router = Router();

router.use(requireAuth);
router.post("/", createTaskHandler);
router.get("/project/:projectId", listTasksByProjectHandler);
router.patch("/:id", updateTaskHandler);
router.delete("/:id", deleteTaskHandler);

export default router;


