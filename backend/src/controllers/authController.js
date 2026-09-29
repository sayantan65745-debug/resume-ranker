import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email exists" });

  const passwordHash = await bcrypt.hash(password, 10);
  const status = role === "RECRUITER" ? "PENDING" : "ACTIVE";
  const user = await User.create({ name, email, passwordHash, role, status });

  res.json({ token: generateToken(user._id), user: { id: user._id, name, email, role, status } });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  if (user.status === "BLOCKED") return res.status(403).json({ message: "Blocked" });

  res.json({ token: generateToken(user._id), user: { id: user._id, name: user.name, email, role: user.role, status: user.status } });
};

export const me = async (req, res) => res.json(req.user);