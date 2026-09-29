import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import * as resumeController from "../controllers/resumeController.js";

const router = Router();

router.use(authenticateUser, authorizeRoles("APPLICANT"));

router.post("/", upload.single("resume"), resumeController.uploadResume);
router.get("/", resumeController.listResumes);
router.get("/:id", resumeController.getResume);
router.delete("/:id", resumeController.deleteResume);
router.put("/:id/default", resumeController.setDefaultResume);

export default router;