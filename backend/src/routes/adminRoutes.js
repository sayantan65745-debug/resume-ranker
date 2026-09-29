import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import * as adminController from "../controllers/adminController.js";

const router = Router();

router.use(authenticateUser, authorizeRoles("ADMIN"));

router.get("/users", adminController.getAllUsers);
router.get("/recruiters", adminController.getAllRecruiters);
router.post("/recruiters/:id/approve", adminController.approveRecruiter);
router.post("/recruiters/:id/reject", adminController.rejectRecruiter);
router.post("/users/:id/block", adminController.blockUser);
router.post("/users/:id/unblock", adminController.unblockUser);
router.delete("/users/:id", adminController.deleteUser);

export default router;