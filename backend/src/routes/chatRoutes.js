import express from "express";
import { accessChatRoom, getChatRooms } from "../controllers/chatService.js";
import { validateObjectId } from "../middlewares/userService.js";

const router = express.Router();

router.get("/:id", validateObjectId, accessChatRoom);
router.get("/", getChatRooms);

export default router;
