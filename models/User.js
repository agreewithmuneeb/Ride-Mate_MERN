import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["driver", "passenger", "admin"],
      default: "passenger",
    },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    cnicImage: { type: String }, // path or dummy string
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
