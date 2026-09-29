import mongoose from "mongoose";

const resumeScoreSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true },
  overallScore: Number,
  topicScores: [
    {
      topicId: mongoose.Schema.Types.ObjectId,
      topicName: String,
      weight: Number,
      matchScore: Number,
      weightedScore: Number
    }
  ],
  calculatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("ResumeScore", resumeScoreSchema);