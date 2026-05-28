import express from "express";
import { register, login, me, updateProfile, googleLogin } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.get("/me", protect, me);
router.put("/profile", protect, updateProfile);

export default router;
