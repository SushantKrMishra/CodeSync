import express from "express";
import {
  getUser,
  getUserProfile,
  getUsers,
  updateUserName,
  updateUserPasscode,
  updateUserProfile,
} from "../controllers/userService.js";

const router = express.Router();

router.get("/users", getUsers);
router.get("/profile", getUserProfile);
router.patch("/profile", updateUserProfile);
router.patch("/profile/username", updateUserName);
router.patch("/profile/passcode", updateUserPasscode);
router.get("/user/:id", getUser);

export default router;
