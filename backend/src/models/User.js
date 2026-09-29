import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["APPLICANT", "RECRUITER", "ADMIN"], default: "APPLICANT" },
    status: { type: String, enum: ["PENDING", "ACTIVE", "BLOCKED"], default: "ACTIVE" }
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

export default mongoose.model("User", userSchema);