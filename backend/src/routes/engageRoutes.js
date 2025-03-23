import express from "express";
import { likeHandler } from "../controllers/likeService.js";
import { validateObjectId } from "../middlewares/userService.js";
const router = express.Router();

router.post("/like/:id", validateObjectId, likeHandler);

export default router;
