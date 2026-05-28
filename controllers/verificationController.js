import User from "../models/User.js";

export const uploadCNIC = async (req, res) => {
  try {
    const { cnicImage } = req.body;

    if (!cnicImage) {
      return res.status(400).json({ message: "CNIC image is required" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { cnicImage, isVerified: true },
      { new: true }
    ).select("-password");

    res.json({ message: "CNIC uploaded, verification approved", user });
  } catch (err) {
    res.status(500).json({ message: "Could not upload CNIC" });
  }
};

export const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.cnicImage) {
      return res.status(400).json({ message: "User has not uploaded CNIC" });
    }

    user.isVerified = true;
    await user.save();

    res.json({ message: "User verified" });
  } catch (err) {
    res.status(400).json({ message: "Invalid user id" });
  }
};

export const rejectUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isVerified = false;
    user.cnicImage = "";
    await user.save();

    res.json({ message: "Verification rejected" });
  } catch (err) {
    res.status(400).json({ message: "Invalid user id" });
  }
};

export const verificationQueue = async (req, res) => {
  try {
    const users = await User.find({ role: "driver", cnicImage: { $exists: true, $ne: "" }, isVerified: false })
      .select("name email role cnicImage createdAt");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch verification queue" });
  }
};
