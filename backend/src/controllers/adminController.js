import User from "../models/User.js";

// Get all users
export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-passwordHash");
  res.json(users);
};

// Get all recruiters
export const getAllRecruiters = async (req, res) => {
  const recruiters = await User.find({ role: "RECRUITER" }).select("-passwordHash");
  res.json(recruiters);
};

// Approve recruiter
export const approveRecruiter = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status: "ACTIVE" },
    { new: true }
  ).select("-passwordHash");
  res.json(user);
};

// Reject recruiter
export const rejectRecruiter = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status: "BLOCKED" },
    { new: true }
  ).select("-passwordHash");
  res.json(user);
};

// Block user
export const blockUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status: "BLOCKED" },
    { new: true }
  ).select("-passwordHash");
  res.json(user);
};

// Unblock user
export const unblockUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status: "ACTIVE" },
    { new: true }
  ).select("-passwordHash");
  res.json(user);
};

// Delete user
export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};