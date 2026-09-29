import mongoose from "mongoose";

const recruiterPermissionSchema = new mongoose.Schema({
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  permission: { type: String, required: true },
  grantedByAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("RecruiterPermission", recruiterPermissionSchema);