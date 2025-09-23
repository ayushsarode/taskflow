import { ZodError } from "zod";

export function errorHandler(err, _req, res, _next) {
  if (err instanceof ZodError) {
    return res.status(400).json({ message: "Validation error", errors: err.flatten() });
  }
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  return res.status(status).json({ message });
}


