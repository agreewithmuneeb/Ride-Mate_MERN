import express from "express";
import {
  deleteUser,
  getDrivers,
  getReports,
  getUsers,
  updateUserRole,
  updateUserStatus,
} from "../controllers/adminController.js";
import { protect, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect, isAdmin);

router.get("/users", getUsers);
router.get("/drivers", getDrivers);
router.patch("/users/:id/role", updateUserRole);
router.patch("/users/:id/status", updateUserStatus);
router.delete("/users/:id", deleteUser);
router.get("/reports", getReports);

export default router;
