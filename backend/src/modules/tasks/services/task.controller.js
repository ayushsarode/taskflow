import { z } from "zod";
import { TaskModel } from "../repositories/task.model.js";

const createTaskSchema = z.object({
  title: z.string().min(1),
  status: z.enum(["todo", "in-progress", "done"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  deadline: z.coerce.date().optional(),
  projectId: z.string().min(1),
  description: z.string().optional(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  status: z.enum(["todo", "in-progress", "done"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  deadline: z.coerce.date().optional().nullable(),
  description: z.string().optional().nullable(),
  order: z.number().optional(),
});

export async function createTaskHandler(req, res, next) {
  try {
    const input = createTaskSchema.parse(req.body);
    const task = await TaskModel.create({ ...input, ownerId: req.user._id });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

export async function listTasksByProjectHandler(req, res, next) {
  try {
    const { projectId } = req.params;
    const { status, priority, minDeadline, maxDeadline, page = 1, limit = 20 } = req.query;

    const filter = { ownerId: req.user._id, projectId };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (minDeadline || maxDeadline) {
      filter.deadline = {};
      if (minDeadline) filter.deadline.$gte = new Date(minDeadline);
      if (maxDeadline) filter.deadline.$lte = new Date(maxDeadline);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      TaskModel.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(Number(limit)),
      TaskModel.countDocuments(filter),
    ]);
    res.json({ items, page: Number(page), limit: Number(limit), total });
  } catch (err) {
    next(err);
  }
}

export async function updateTaskHandler(req, res, next) {
  try {
    const id = req.params.id;
    const input = updateTaskSchema.parse(req.body);
    const task = await TaskModel.findOneAndUpdate({ _id: id, ownerId: req.user._id }, input, { new: true });
    if (!task) return res.status(404).json({ message: "Not found" });
    res.json(task);
  } catch (err) {
    next(err);
  }
}

export async function deleteTaskHandler(req, res, next) {
  try {
    const id = req.params.id;
    const result = await TaskModel.deleteOne({ _id: id, ownerId: req.user._id });
    if (result.deletedCount === 0) return res.status(404).json({ message: "Not found" });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}


