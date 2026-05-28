import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isVerified: user.isVerified,
  isActive: user.isActive,
  cnicImage: user.cnicImage,
});

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const allowedRoles = ["driver", "passenger"];
    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: role || "passenger",
    });

    res.status(201).json({
      token: generateToken(user._id),
      user: publicUser(user),
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    if (user.isActive === false) return res.status(403).json({ message: "Account is disabled" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      token: generateToken(user._id),
      user: publicUser(user),
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};

export const me = async (req, res) => {
  res.json({ user: publicUser(req.user) });
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updates = {};

    if (email && email !== req.user.email) {
      const existing = await User.findOne({ email, _id: { $ne: req.user._id } });
      if (existing) return res.status(400).json({ message: "Email already in use" });
      updates.email = email;
    }

    if (name) updates.name = name;
    if (password) updates.password = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Could not update profile" });
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { idToken, role } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "Google ID token is required" });
    }

    let payload;
    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (verifyErr) {
      try {
        const fallbackRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
        if (fallbackRes.ok) {
          payload = await fallbackRes.json();
        } else {
          throw new Error("Invalid token signature");
        }
      } catch (fallbackErr) {
        return res.status(401).json({ message: "Invalid Google ID token signature" });
      }
    }

    if (!payload || !payload.email) {
      return res.status(400).json({ message: "Failed to retrieve user email from Google account" });
    }

    const { email, name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      const allowedRoles = ["driver", "passenger"];
      const selectedRole = role && allowedRoles.includes(role) ? role : "passenger";

      const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
      const hashed = await bcrypt.hash(randomPassword, 10);

      user = await User.create({
        name: name || email.split("@")[0],
        email,
        password: hashed,
        role: selectedRole,
        isVerified: true,
      });
    } else {
      if (user.isActive === false) {
        return res.status(403).json({ message: "Account is disabled" });
      }
    }

    res.json({
      token: generateToken(user._id),
      user: publicUser(user),
    });
  } catch (err) {
    res.status(500).json({ message: "Google Authentication failed" });
  }
};

