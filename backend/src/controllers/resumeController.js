import Resume from "../models/Resume.js";
import { extractText } from "../services/resumeAnalysisService.js";
import { deleteFile } from "../services/fileStorageService.js";

// POST /api/resumes
export const uploadResume = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  try {
    const text = await extractText(req.file.path, req.file.mimetype);

    const existing = await Resume.countDocuments({ applicantId: req.user._id });
    const isFirst = existing === 0;

    const label =
      (req.body.label && req.body.label.trim()) ||
      req.file.originalname.replace(/\.[^.]+$/, "");

    const resume = await Resume.create({
      applicantId: req.user._id,
      label,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      extractedText: text,
      isDefault: isFirst,
    });

    res.status(201).json(resume);
  } catch (err) {
    console.error("Resume upload failed:", err);
    try {
      await deleteFile(req.file.path);
    } catch {}
    res.status(500).json({ message: err.message || "Failed to process resume" });
  }
};

// GET /api/resumes
export const listResumes = async (req, res) => {
  const resumes = await Resume.find({ applicantId: req.user._id }).sort({
    uploadedAt: -1,
  });
  res.json(resumes);
};

// GET /api/resumes/:id
export const getResume = async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    applicantId: req.user._id,
  });
  if (!resume) return res.status(404).json({ message: "Resume not found" });
  res.json(resume);
};

// DELETE /api/resumes/:id
export const deleteResume = async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    applicantId: req.user._id,
  });
  if (!resume) return res.status(404).json({ message: "Resume not found" });

  await deleteFile(resume.filePath);
  await Resume.deleteOne({ _id: resume._id });

  if (resume.isDefault) {
    const next = await Resume.findOne({ applicantId: req.user._id }).sort({
      uploadedAt: -1,
    });
    if (next) {
      next.isDefault = true;
      await next.save();
    }
  }

  res.json({ message: "Resume deleted" });
};

// PUT /api/resumes/:id/default
export const setDefaultResume = async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    applicantId: req.user._id,
  });
  if (!resume) return res.status(404).json({ message: "Resume not found" });

  await Resume.updateMany(
    { applicantId: req.user._id },
    { $set: { isDefault: false } }
  );
  resume.isDefault = true;
  await resume.save();

  res.json(resume);
};