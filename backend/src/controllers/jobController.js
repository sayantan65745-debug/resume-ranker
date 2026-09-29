import Job from "../models/Job.js";

export const getJobs = async (req, res) => {
  let filter = {};
  if (req.user.role === "RECRUITER") {
    filter = { recruiterId: req.user._id };
  } else if (req.user.role === "APPLICANT") {
    filter = { status: "OPEN" };
  } else if (req.user.role === "ADMIN") {
    filter = {};  // admins see everything
  }
  const jobs = await Job.find(filter);
  res.json(jobs);
};

export const getJobById = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  res.json(job);
};

export const createJob = async (req, res) => {
  const job = await Job.create({ ...req.body, recruiterId: req.user._id });
  res.status(201).json(job);
};

export const updateJob = async (req, res) => {
  const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(job);
};

export const deleteJob = async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.json({ message: "Job deleted" });
};

export const setTopics = async (req, res) => {
  const { topics } = req.body;
  const sum = topics.reduce((acc, t) => acc + t.weight, 0);
  if (sum !== 100) return res.status(400).json({ message: "Weights must sum to 100" });
  
  const job = await Job.findByIdAndUpdate(
    req.params.id, 
    { topics }, 
    { new: true }
  );
  res.json(job);
};