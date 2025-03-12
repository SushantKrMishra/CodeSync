import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  sessionAuthValid,
} from "../controllers/userAuth.js";
import { userAuthMiddleware } from "../middlewares/userAuth.js";
const router = express.Router();

router.get("/sessionAuthValid", userAuthMiddleware, sessionAuthValid);
router.post("/signup", createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router;
