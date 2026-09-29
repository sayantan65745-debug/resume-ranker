import Application from "../models/Application.js";
import ResumeScore from "../models/ResumeScore.js";
import Resume from "../models/Resume.js";
import { assignRelativeRanks } from "../services/rankingService.js";

// GET /api/rankings/job/:id  (recruiter only)
export const getJobRankings = async (req, res) => {
  try {
    const apps = await Application.find({ jobId: req.params.id })
      .populate("applicantId", "name email")
      .populate("resumeId", "label fileName");

    const scores = await ResumeScore.find({
      applicationId: { $in: apps.map((a) => a._id) },
    });

    const data = apps.map((app) => {
      const score = scores.find(
        (s) => s.applicationId.toString() === app._id.toString()
      );
      return {
        applicationId: app._id,
        applicant: app.applicantId,
        resume: {
          label: app.resumeId?.label,
          fileName: app.resumeId?.fileName,
        },
        overallScore: score?.overallScore || 0,
        topicScores: score?.topicScores || [],
      };
    });

    res.json(assignRelativeRanks(data));
  } catch (err) {
    console.error("getJobRankings failed:", err);
    res.status(500).json({ message: err.message || "Failed to load rankings" });
  }
};

// GET /api/rankings/application/:id  (applicant only)
export const getApplicantScore = async (req, res) => {
  try {
    const score = await ResumeScore.findOne({
      applicationId: req.params.id,
    });
    if (!score) return res.status(404).json({ message: "Score not found" });

    const app = await Application.findById(req.params.id);
    if (!app)
      return res.status(404).json({ message: "Application not found" });

    const total = await Application.countDocuments({ jobId: app.jobId });

    const allApps = await Application.find({ jobId: app.jobId });
    const allScores = await ResumeScore.find({
      applicationId: { $in: allApps.map((a) => a._id) },
    }).sort({ overallScore: -1 });

    const rank =
      allScores.findIndex(
        (s) => s.applicationId.toString() === req.params.id
      ) + 1;

    res.json({
      score: score.overallScore,
      rank,
      total,
      topicScores: score.topicScores,
    });
  } catch (err) {
    console.error("getApplicantScore failed:", err);
    res.status(500).json({ message: err.message || "Failed to load score" });
  }
};