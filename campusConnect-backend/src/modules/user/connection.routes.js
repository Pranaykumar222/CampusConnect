import express from "express";
import { sendConnectionRequest,respondToConnectionRequest,getMyConnections,getPendingRequests,cancelConnectionRequest,removeConnection,getConnectionStatus } from "../user/connection.controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/status/:userId", authMiddleware, getConnectionStatus);

router.post("/:userId", authMiddleware, sendConnectionRequest);

router.patch("/:connectionId/respond", authMiddleware, respondToConnectionRequest);

router.get("/", authMiddleware, getMyConnections);
router.get("/requests", authMiddleware, getPendingRequests);

router.delete("/:connectionId/cancel",authMiddleware,cancelConnectionRequest);
router.delete("/:connectionId/remove",authMiddleware,removeConnection);
  


export default router;
