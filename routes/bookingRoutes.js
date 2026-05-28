import express from "express";
import { createBooking, updateBookingStatus, myBookings, driverBookings, adminBookings, deleteBooking } from "../controllers/bookingController.js";
import { protect, isAdmin, isDriver } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/my", protect, myBookings);
router.get("/driver", protect, isDriver, driverBookings);
router.get("/admin", protect, isAdmin, adminBookings);
router.patch("/:id", protect, updateBookingStatus);
router.delete("/:id", protect, deleteBooking);

export default router;
