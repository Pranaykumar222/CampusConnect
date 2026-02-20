import express from "express";
import { discoverUsers } from "../user/discover.controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/users", authMiddleware, discoverUsers);

export default router;
