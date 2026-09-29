import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: "Resume", required: true },
  status: { type: String, default: "APPLIED" },
  appliedAt: { type: Date, default: Date.now },
});

// Non-unique index for fast per-applicant queries
applicationSchema.index({ jobId: 1, applicantId: 1 });

// Prevent the same resume from being submitted twice to the same job
applicationSchema.index({ jobId: 1, resumeId: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);