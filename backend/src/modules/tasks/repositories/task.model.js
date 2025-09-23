import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    status: { type: String, enum: ["todo", "in-progress", "done"], default: "todo", index: true },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium", index: true },
    deadline: { type: Date },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    description: { type: String, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const TaskModel = mongoose.model("Task", taskSchema);


