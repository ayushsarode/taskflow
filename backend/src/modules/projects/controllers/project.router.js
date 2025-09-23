import { Router } from "express";
import { requireAuth } from "../../auth/services/auth.controller.js";
import { createProjectHandler, deleteProjectHandler, listProjectsHandler } from "../services/project.controller.js";

const router = Router();

router.use(requireAuth);
router.post("/", createProjectHandler);
router.get("/", listProjectsHandler);
router.delete("/:id", deleteProjectHandler);

export default router;


