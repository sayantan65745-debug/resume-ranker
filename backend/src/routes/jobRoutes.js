import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import * as jobController from "../controllers/jobController.js";

const router = Router();

router.use(authenticateUser);

// Anyone logged in can view jobs
router.get("/", jobController.getJobs);
router.get("/:id", jobController.getJobById);

// Only recruiters can create/modify/delete
router.post("/", authorizeRoles("RECRUITER"), jobController.createJob);
router.put("/:id", authorizeRoles("RECRUITER"), jobController.updateJob);
router.delete("/:id", authorizeRoles("RECRUITER"), jobController.deleteJob);
router.put("/:id/topics", authorizeRoles("RECRUITER"), jobController.setTopics);

export default router;