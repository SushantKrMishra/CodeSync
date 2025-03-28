import express from "express";
import { addComment, deleteComment } from "../controllers/commentService.js";
import { likeHandler } from "../controllers/likeService.js";
import { validateObjectId } from "../middlewares/userService.js";
const router = express.Router();

router.post("/like/:id", validateObjectId, likeHandler);
router.post("/comment/:id", validateObjectId, addComment);
router.delete("/comment/:id", validateObjectId, deleteComment);

export default router;
