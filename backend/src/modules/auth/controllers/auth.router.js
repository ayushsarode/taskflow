import { Router } from "express";
import { signupHandler, loginHandler, meHandler, logoutHandler, deleteAccountHandler } from "../services/auth.controller.js";
import { requireAuth } from "../services/auth.controller.js";

const router = Router();

router.post("/signup", signupHandler);
router.post("/login", loginHandler);
router.post("/logout", requireAuth, logoutHandler);
router.get("/me", requireAuth, meHandler);
router.delete("/delete-account", requireAuth, deleteAccountHandler);

export default router;


