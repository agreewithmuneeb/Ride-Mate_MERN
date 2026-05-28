import mongoose from "mongoose";

const rideSchema = new mongoose.Schema(
  {
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    origin: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    seats: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Ride", rideSchema);
