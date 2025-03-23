import express from "express";
import { upload } from "../config/multer.js";
import {
  createPost,
  deletePost,
  feeds,
  getMyPosts,
  getPost,
  updatePost,
} from "../controllers/feedService.js";
import { validateObjectId } from "../middlewares/userService.js";
const router = express.Router();

router.post("/create", upload.single("image"), createPost);
router.get("/myPosts", getMyPosts);
router.delete("/:id", validateObjectId, deletePost);
router.patch("/:id", validateObjectId, upload.single("image"), updatePost);
router.get("/:id", validateObjectId, getPost);

router.get("/", feeds);

export default router;
