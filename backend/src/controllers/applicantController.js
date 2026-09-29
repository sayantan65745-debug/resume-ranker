import Resume from "../models/Resume.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import ResumeScore from "../models/ResumeScore.js";
import { calculateScore } from "../services/rankingService.js";

// POST /api/applicant/jobs/:id/apply
export const applyToJob = async (req, res) => {
  try {
    const { resumeId } = req.body || {};
    if (!resumeId) {
      return res.status(400).json({ message: "resumeId is required" });
    }

    const resume = await Resume.findOne({
      _id: resumeId,
      applicantId: req.user._id,
    });
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const existing = await Application.findOne({
      jobId: job._id,
      resumeId: resume._id,
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "This resume has already been submitted to this job" });
    }

    const application = await Application.create({
      jobId: job._id,
      applicantId: req.user._id,
      resumeId: resume._id,
    });

    const score = calculateScore(resume.extractedText, job.topics || []);
    await ResumeScore.create({ applicationId: application._id, ...score });

    res.json({ application, score });
  } catch (err) {
    console.error("applyToJob failed:", err);
    if (err.code === 11000) {
      return res.status(400).json({
        message: "This resume has already been submitted to this job",
      });
    }
    res.status(500).json({ message: err.message || "Failed to apply" });
  }
};

// GET /api/applicant/applications
export const myApplications = async (req, res) => {
  const apps = await Application.find({ applicantId: req.user._id })
    .populate("jobId", "title location experience")
    .populate("resumeId", "label fileName")
    .sort({ appliedAt: -1 });
  res.json(apps);
};

// GET /api/applicant/applications/:id/score  (kept for convenience; the frontend uses /api/rankings/application/:id)
export const myScore = async (req, res) => {
  const score = await ResumeScore.findOne({ applicationId: req.params.id });
  if (!score) return res.status(404).json({ message: "Score not found" });

  const app = await Application.findById(req.params.id);
  if (!app) return res.status(404).json({ message: "Application not found" });

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
};