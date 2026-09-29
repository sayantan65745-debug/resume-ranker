import Job from "../models/Job.js";
import Application from "../models/Application.js";
import ResumeScore from "../models/ResumeScore.js";
import { assignRelativeRanks } from "../services/rankingService.js";

export const createJob = async (req, res) => {
  const job = await Job.create({ ...req.body, recruiterId: req.user._id });
  res.json(job);
};

export const setTopics = async (req, res) => {
  const { topics } = req.body;
  const sum = topics.reduce((s, t) => s + t.weight, 0);
  if (sum !== 100) return res.status(400).json({ message: "Weights must sum to 100" });
  const job = await Job.findByIdAndUpdate(req.params.id, { topics }, { new: true });
  res.json(job);
};

export const getRankings = async (req, res) => {
  const apps = await Application.find({ jobId: req.params.id }).populate("applicantId", "name email");
  const scores = await ResumeScore.find({ applicationId: { $in: apps.map(a => a._id) } });
  const data = apps.map(app => {
    const score = scores.find(s => s.applicationId.toString() === app._id.toString());
    return { applicant: app.applicantId, score: score?.overallScore || 0, applicationId: app._id };
  });
  res.json(assignRelativeRanks(data));
};