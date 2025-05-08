import express from "express";
import { deleteComment, getComments, postComment } from "../controllers/comment.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get('/:id', getComments);
router.post('/', protectRoute, postComment);
router.delete('/:id', protectRoute, deleteComment);

export default router;