import Booking from "../models/Booking.js";
import Ride from "../models/Ride.js";
import User from "../models/User.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch users" });
  }
};

export const getDrivers = async (req, res) => {
  try {
    const drivers = await User.find({ role: "driver" }).select("-password").sort({ createdAt: -1 });
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch drivers" });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const allowedRoles = ["passenger", "driver", "admin"];
    if (!allowedRoles.includes(role)) return res.status(400).json({ message: "Invalid role" });

    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role;
    if (role !== "driver") user.isVerified = false;
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Could not update user role" });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = req.body.isActive !== undefined ? Boolean(req.body.isActive) : !user.isActive;
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Could not update user status" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const rides = await Ride.find({ driver: user._id }).select("_id");
    await Booking.deleteMany({
      $or: [
        { passenger: user._id },
        { ride: { $in: rides.map((ride) => ride._id) } },
      ],
    });
    await Ride.deleteMany({ driver: user._id });
    await user.deleteOne();

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Could not delete user" });
  }
};

export const getReports = async (req, res) => {
  try {
    const [totalUsers, totalDrivers, totalRides, totalBookings, pendingBookings, acceptedBookings, rejectedBookings, pendingVerifications] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: "driver" }),
        Ride.countDocuments(),
        Booking.countDocuments(),
        Booking.countDocuments({ status: "pending" }),
        Booking.countDocuments({ status: "accepted" }),
        Booking.countDocuments({ status: "rejected" }),
        User.countDocuments({ role: "driver", cnicImage: { $exists: true, $ne: "" }, isVerified: false }),
      ]);

    const latestBookings = await Booking.find()
      .populate("passenger", "name email")
      .populate({ path: "ride", populate: { path: "driver", select: "name email" } })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totals: {
        totalUsers,
        totalDrivers,
        totalRides,
        totalBookings,
        pendingBookings,
        acceptedBookings,
        rejectedBookings,
        pendingVerifications,
      },
      latestBookings,
    });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch reports" });
  }
};
