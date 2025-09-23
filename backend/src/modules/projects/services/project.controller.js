import { z } from "zod";
import { ProjectModel } from "../repositories/project.model.js";

const createProjectSchema = z.object({ name: z.string().min(1), description: z.string().optional() });

export async function createProjectHandler(req, res, next) {
  try {
    const input = createProjectSchema.parse(req.body);
    const project = await ProjectModel.create({ ...input, ownerId: req.user._id });
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
}

export async function listProjectsHandler(req, res, next) {
  try {
    const projects = await ProjectModel.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
    res.json({ items: projects });
  } catch (err) {
    next(err);
  }
}

export async function deleteProjectHandler(req, res, next) {
  try {
    const id = req.params.id;
    const result = await ProjectModel.deleteOne({ _id: id, ownerId: req.user._id });
    if (result.deletedCount === 0) return res.status(404).json({ message: "Not found" });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}


