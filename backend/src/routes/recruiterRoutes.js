import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { createJob, setTopics, getRankings } from "../controllers/recruiterController.js";

const router = Router();
router.use(authenticateUser, authorizeRoles("RECRUITER"));
router.post("/jobs", createJob);
router.put("/jobs/:id/topics", setTopics);
router.get("/jobs/:id/rankings", getRankings);
export default router;