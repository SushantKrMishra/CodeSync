import express from "express";
import {
  sendConnectionRequest,
  withdrawConnectionRequest,
} from "../controllers/connectionService.js";

const router = express.Router();

router.post("/request/:id", sendConnectionRequest);
router.post("/withdraw/:id", withdrawConnectionRequest);

export default router;
