import express from "express";
import { createRide, getRides, getRideById, getMyRides, updateRide, deleteRide } from "../controllers/rideController.js";
import { protect, isVerifiedDriver } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, isVerifiedDriver, createRide);
router.get("/", getRides);
router.get("/my", protect, getMyRides);
router.get("/:id", getRideById);
router.put("/:id", protect, updateRide);
router.delete("/:id", protect, deleteRide);

export default router;
