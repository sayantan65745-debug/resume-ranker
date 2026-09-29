import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: String,
    description: String,
    location: String,
    experience: String,
    status: { type: String, default: "OPEN" },
    topics: [
      {
        topicId: mongoose.Schema.Types.ObjectId,
        name: String,
        weight: Number,
        priorityOrder: Number
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);