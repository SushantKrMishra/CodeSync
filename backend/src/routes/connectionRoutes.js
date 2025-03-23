import express from "express";
import {
  connectionSuggestion,
  handleConnectionRequest,getConnections,
  sendConnectionRequest,
  withdrawConnectionRequest,
} from "../controllers/connectionService.js";

const router = express.Router();

router.post("/request/:id", sendConnectionRequest);
router.post("/withdraw/:id", withdrawConnectionRequest);
router.post("/review/:status/:id", handleConnectionRequest);
router.get("/suggestions", connectionSuggestion);
router.get("/", getConnections);

export default router;
