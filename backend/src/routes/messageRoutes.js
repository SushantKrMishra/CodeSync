import express from "express";
import { createMessage, getMessages } from "../controllers/chatService.js";
import { validateObjectId } from "../middlewares/userService.js";

const router = express.Router();

router.get("/:id", validateObjectId, getMessages);
router.post("/", createMessage);

export default router;
