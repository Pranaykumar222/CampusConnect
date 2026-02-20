import express from "express";
import {getNotifications,markAsRead,markAllAsRead,deleteNotification} from "../notification/notification.controller.js";
import authMiddleware from "../../middleware/authMiddleware.js"; // your auth middleware

const router = express.Router();

router.use(authMiddleware); 

router.get("/", getNotifications);

router.patch("/:id/read", markAsRead);
router.patch("/read-all", markAllAsRead);

router.delete("/:id", deleteNotification); 

export default router;
