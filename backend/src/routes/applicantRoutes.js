import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {
  applyToJob,
  myApplications,
  myScore,
} from "../controllers/applicantController.js";

const router = Router();

router.use(authenticateUser, authorizeRoles("APPLICANT"));

router.post("/jobs/:id/apply", applyToJob);
router.get("/applications", myApplications);
router.get("/applications/:id/score", myScore);

export default router;