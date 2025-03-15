import express from "express";
import {
  createPost,
  deletePost,
  feeds,
  getMyPosts,
  updatePost,
} from "../controllers/feedService.js";
import { validateObjectId } from "../middlewares/userService.js";
const router = express.Router();

router.post("/create", createPost);
router.get("/myPosts", getMyPosts);
router.delete("/:id", validateObjectId, deletePost);
router.patch("/:id", validateObjectId, updatePost);

router.get("/", feeds);

export default router;
