import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const [scheme, token] = req.headers.authorization?.split(" ") || [];
    if (scheme !== "Bearer" || !token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ message: "User not found" });
    if (req.user.isActive === false) return res.status(403).json({ message: "Account is disabled" });

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const isDriver = (req, res, next) => {
  if (req.user.role !== "driver") {
    return res.status(403).json({ message: "Driver only" });
  }
  next();
};

export const isVerifiedDriver = (req, res, next) => {
  if (req.user.role !== "driver") {
    return res.status(403).json({ message: "Driver only" });
  }
  if (!req.user.isVerified) {
    return res.status(403).json({ message: "Driver verification required" });
  }
  next();
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};
