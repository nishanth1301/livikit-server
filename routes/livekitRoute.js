import express from "express";
import {
  sendMessage,
  tokenGenerate,
} from "../controllers/livekitController.js";
const router = express.Router();

router.post("/livekit/tokenGenerate", tokenGenerate);
router.post("/livekit/sendMessage", sendMessage);

export { router };
