import express from "express";
import {
  getUser,
  getUserProfile,
  getUsers,
  updateUserProfile,
} from "../controllers/userService.js";

const router = express.Router();

router.get("/users", getUsers);
router.get("/profile", getUserProfile);
router.patch("/profile", updateUserProfile);
//TODO:PATCH Username and password
router.get("/user/:id", getUser);

export default router;
