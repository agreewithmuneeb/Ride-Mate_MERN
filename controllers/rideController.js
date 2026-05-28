import Ride from "../models/Ride.js";
import Booking from "../models/Booking.js";

export const createRide = async (req, res) => {
  try {
    const { origin, destination, date, seats, price, isActive } = req.body;

    if (!origin || !destination || !date || seats === undefined || price === undefined) {
      return res.status(400).json({ message: "Origin, destination, date, seats, and price are required" });
    }

    const ride = await Ride.create({
      origin,
      destination,
      date,
      seats,
      price,
      isActive: isActive !== undefined ? isActive : true,
      driver: req.user._id,
    });

    res.status(201).json(ride);
  } catch (err) {
    res.status(500).json({ message: "Could not create ride" });
  }
};

export const getRides = async (req, res) => {
  try {
    const rides = await Ride.find({ isActive: { $ne: false } }).populate("driver", "name email");
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch rides" });
  }
};

export const getMyRides = async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.user._id }).sort({ createdAt: -1 });
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch your rides" });
  }
};

export const getRideById = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate("driver", "name");
    if (!ride) return res.status(404).json({ message: "Ride not found" });
    res.json(ride);
  } catch (err) {
    res.status(400).json({ message: "Invalid ride id" });
  }
};

export const updateRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    const ownsRide = ride.driver.equals(req.user._id);
    if (!ownsRide && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only update your own rides" });
    }
    if (req.user.role === "driver" && !req.user.isVerified) {
      return res.status(403).json({ message: "Driver verification required" });
    }

    const { origin, destination, date, seats, price, isActive } = req.body;
    if (origin !== undefined) ride.origin = origin;
    if (destination !== undefined) ride.destination = destination;
    if (date !== undefined) ride.date = date;
    if (seats !== undefined) ride.seats = Number(seats);
    if (price !== undefined) ride.price = Number(price);
    if (isActive !== undefined) ride.isActive = Boolean(isActive);

    await ride.save();
    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: "Could not update ride" });
  }
};

export const deleteRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    const ownsRide = ride.driver.equals(req.user._id);
    if (!ownsRide && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only delete your own rides" });
    }

    await Booking.deleteMany({ ride: ride._id });
    await ride.deleteOne();
    res.json({ message: "Ride deleted" });
  } catch (err) {
    res.status(500).json({ message: "Could not delete ride" });
  }
};
