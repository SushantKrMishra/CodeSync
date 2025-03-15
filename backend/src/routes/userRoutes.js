import express from "express";
import {
  getConnections,
  getRecievedConnectionRequest,
  getSendConnectionRequest,
  getUser,
  getUserProfile,
  getUsers,
  updateUserName,
  updateUserPasscode,
  updateUserProfile,
} from "../controllers/userService.js";
import { validateObjectId } from "../middlewares/userService.js";

const router = express.Router();

router.get("/users", getUsers);
router.get("/profile", getUserProfile);
router.patch("/profile", updateUserProfile);
router.patch("/profile/username", updateUserName);
router.patch("/profile/passcode", updateUserPasscode);
router.get("/connectionRequest/recieved", getRecievedConnectionRequest);
router.get("/connectionRequest/send", getSendConnectionRequest);
router.get("/connections", getConnections);

// TODO: Forgot password
router.get("/user/:id", validateObjectId, getUser);

export default router;
