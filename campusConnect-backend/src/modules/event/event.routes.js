import express from "express";
import {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  toggleEventRegistration,
  toggleSaveEvent,
  deleteEvent,
} from "../event/event.controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createEvent);

router.get("/", getEvents);

router.get("/:eventId", getEvent);

router.patch("/:eventId", updateEvent);


router.post("/:eventId/rsvp", toggleEventRegistration);


router.post("/:eventId/save", toggleSaveEvent);


router.delete("/:eventId", deleteEvent);

export default router;
