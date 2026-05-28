import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    ride: { type: mongoose.Schema.Types.ObjectId, ref: "Ride", required: true },
    passenger: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

bookingSchema.index({ ride: 1, passenger: 1 }, { unique: true });

export default mongoose.model("Booking", bookingSchema);
