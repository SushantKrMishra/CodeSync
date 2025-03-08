import express from "express";
import {
  createPost,
  deletePost,
  feeds,
  getMyPosts,
  updatePost,
} from "../controllers/feedService.js";
const router = express.Router();

router.post("/create", createPost);
router.get("/myPosts", getMyPosts);
router.delete("/:id", deletePost);
router.patch("/:id", updatePost);

//This is default route for feed /feed
router.get("/", feeds);

export default router;
