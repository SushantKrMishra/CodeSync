import express from "express";
import {
  sendConnectionRequest,
  withdrawConnectionRequest,handleConnectionRequest
} from "../controllers/connectionService.js";

const router = express.Router();

router.post("/request/:id", sendConnectionRequest);
router.post("/withdraw/:id", withdrawConnectionRequest);
router.post("/review/:status/:id", handleConnectionRequest);

export default router;
