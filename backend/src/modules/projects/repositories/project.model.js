import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export const ProjectModel = mongoose.model("Project", projectSchema);


