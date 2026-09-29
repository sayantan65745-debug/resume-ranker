import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    label: { type: String, default: "Untitled" },
    fileName: String,
    filePath: String,
    fileType: String,
    extractedText: String,
    isDefault: { type: Boolean, default: false },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);