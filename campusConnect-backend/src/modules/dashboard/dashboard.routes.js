import express from "express";
import { getDashboardOverview } from "./dashboard.controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/overview", authMiddleware, getDashboardOverview);

export default router;
