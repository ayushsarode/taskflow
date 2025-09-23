import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { UserModel } from "../../users/repositories/user.model.js";
import { ProjectModel } from "../../projects/repositories/project.model.js";
import { TaskModel } from "../../tasks/repositories/task.model.js";

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

function signToken(user) {
  const payload = { sub: user._id.toString(), email: user.email, name: user.name };
  const secret = process.env.JWT_SECRET || "dev-secret";
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign(payload, secret, { expiresIn });
}

export async function signupHandler(req, res, next) {
  try {
    const input = signupSchema.parse(req.body);
    const existing = await UserModel.findOne({ email: input.email });
    if (existing) return res.status(409).json({ message: "Email already in use" });
    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await UserModel.create({ name: input.name, email: input.email, passwordHash });
    const token = signToken(user);
    return res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
}

export async function loginHandler(req, res, next) {
  try {
    const input = loginSchema.parse(req.body);
    const user = await UserModel.findOne({ email: input.email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    const token = signToken(user);
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
}

export async function meHandler(req, res) {
  const user = req.user;
  return res.json({ user: { id: user._id, name: user.name, email: user.email } });
}

export async function logoutHandler(_req, res) {
  // For JWT stateless auth, client just discards token. Endpoint provided for symmetry.
  return res.json({ message: "Logged out" });
}

export const deleteAccountHandler = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all projects for this user
    const userProjects = await ProjectModel.find({ userId });
    const projectIds = userProjects.map(project => project._id);

    // Delete all tasks associated with these projects
    if (projectIds.length > 0) {
      await TaskModel.deleteMany({ projectId: { $in: projectIds } });
    }

    // Delete all projects associated with the user
    await ProjectModel.deleteMany({ userId });

    // Delete the user account
    await UserModel.findByIdAndDelete(userId);

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ message: "Failed to delete account" });
  }
};

export function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const secret = process.env.JWT_SECRET || "dev-secret";
    const payload = jwt.verify(token, secret);
    req.user = { _id: payload.sub, email: payload.email, name: payload.name };
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}