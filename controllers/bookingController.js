import Booking from "../models/Booking.js";
import Ride from "../models/Ride.js";

export const createBooking = async (req, res) => {
  try {
    const { rideId } = req.body;

    if (!rideId) return res.status(400).json({ message: "Ride id is required" });

    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found" });
    if (ride.driver.equals(req.user._id)) {
      return res.status(400).json({ message: "Drivers cannot book their own rides" });
    }

    const existing = await Booking.findOne({ ride: rideId, passenger: req.user._id });
    if (existing) return res.status(400).json({ message: "Ride already booked" });

    const booking = await Booking.create({
      ride: rideId,
      passenger: req.user._id,
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: "Could not create booking" });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["pending", "accepted", "rejected", "completed"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid booking status" });
    }

    const booking = await Booking.findById(req.params.id).populate("ride");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (!booking.ride) return res.status(404).json({ message: "Ride not found" });

    const isRideDriver = booking.ride.driver.equals(req.user._id);
    if (!isRideDriver && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only the ride driver or admin can update this booking" });
    }

    if (status === "accepted" && booking.status !== "accepted") {
      if (booking.ride.seats < 1) {
        return res.status(400).json({ message: "No seats available" });
      }
      booking.ride.seats -= 1;
      await booking.ride.save();

      // Trigger a 30-second timer to auto-complete this booking
      setTimeout(async () => {
        try {
          const currentBooking = await Booking.findById(booking._id);
          if (currentBooking && currentBooking.status === "accepted") {
            currentBooking.status = "completed";
            await currentBooking.save();
            console.log(`[Auto-Complete] Booking ${booking._id} marked as completed after 30 seconds.`);
          }
        } catch (timerErr) {
          console.error(`[Auto-Complete] Error automatically completing booking ${booking._id}:`, timerErr);
        }
      }, 30000);
    }

    if (booking.status === "accepted" && status !== "accepted" && status !== "completed") {
      booking.ride.seats += 1;
      await booking.ride.save();
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Could not update booking" });
  }
};

export const myBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ passenger: req.user._id })
      .populate({ path: "ride", populate: { path: "driver", select: "name email" } })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch bookings" });
  }
};

export const driverBookings = async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.user._id }).select("_id");
    const rideIds = rides.map((ride) => ride._id);
    const bookings = await Booking.find({ ride: { $in: rideIds } })
      .populate("ride")
      .populate("passenger", "name email")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch driver bookings" });
  }
};

export const adminBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate({ path: "ride", populate: { path: "driver", select: "name email" } })
      .populate("passenger", "name email")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch bookings" });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("ride");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const ownsBooking = booking.passenger.equals(req.user._id);
    const ownsRide = booking.ride?.driver?.equals(req.user._id);
    if (!ownsBooking && !ownsRide && req.user.role !== "admin") {
      return res.status(403).json({ message: "You cannot delete this booking" });
    }

    if (booking.status === "accepted" && booking.ride) {
      booking.ride.seats += 1;
      await booking.ride.save();
    }

    await booking.deleteOne();
    res.json({ message: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ message: "Could not delete booking" });
  }
};
