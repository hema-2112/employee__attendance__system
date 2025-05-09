import express from "express";
import { addLeave, getLeavesByUserId, getLeaves, getLeaveDetail, updateLeave} from "../controllers/leaveController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Add leave
router.post("/add", authMiddleware, addLeave);

// ✅ Get leaves for a specific user
router.get('/detail/:id', authMiddleware, getLeaveDetail)
router.get("/:id/:role", authMiddleware, getLeavesByUserId)
router.get('/', authMiddleware, getLeaves)
router.put('/:id', authMiddleware, updateLeave)

export default router;
