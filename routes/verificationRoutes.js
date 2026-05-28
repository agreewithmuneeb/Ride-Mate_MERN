import express from "express";
import { uploadCNIC, approveUser, rejectUser, verificationQueue } from "../controllers/verificationController.js";
import { protect, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/upload", protect, uploadCNIC);
router.patch("/:userId/approve", protect, isAdmin, approveUser);
router.patch("/:userId/reject", protect, isAdmin, rejectUser);
router.get("/queue", protect, isAdmin, verificationQueue);

export default router;
