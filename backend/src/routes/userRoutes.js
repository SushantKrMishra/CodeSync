import express from "express";
import { getUsers } from "../controllers/userService.js";

const router = express.Router();

router.get("/users", getUsers);

export default router;
