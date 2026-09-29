import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import * as rankingController from "../controllers/rankingController.js";

const router = Router();

router.use(authenticateUser);

// Recruiter gets full rankings
router.get("/job/:id", authorizeRoles("RECRUITER"), rankingController.getJobRankings);

// Applicant gets only their own score
router.get("/application/:id", authorizeRoles("APPLICANT"), rankingController.getApplicantScore);

export default router;