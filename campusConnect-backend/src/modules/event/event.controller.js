import Event from "./event.model.js";

export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      date,
      time,
      location,
      maxAttendees,
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      !date ||
      !time ||
      !location ||
      !maxAttendees
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const event = await Event.create({
      title,
      description,
      category,
      date,
      time,
      location,
      maxAttendees,
      createdBy: req.user._id,
    });

    res.status(201).json({ event });
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getEvents = async (req, res) => {
  try {
    const {
      category,
      search,
      createdBy,
      page = 1,
      limit = 6,
    } = req.query;

    const query = {};

    if (category) query.category = category;
    if (createdBy) query.createdBy = createdBy;
    if (search)
      query.title = { $regex: search, $options: "i" };

    const total = await Event.countDocuments(query);

    const events = await Event.find(query)
      .populate("createdBy", "firstName lastName")
      .populate("attendees", "firstName lastName")
      .populate("savedBy", "_id")
      .sort({ date: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

      const now = new Date();

events.forEach((event) => {
  if (new Date(event.date) < now) {
    event.isPast = true;
  }
});


    res.json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    });

  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId)
      .populate("createdBy", "firstName lastName")
      .populate("attendees", "firstName lastName")
      .populate("savedBy", "_id");

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    res.json({ event });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    if (event.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    const {
      title,
      description,
      category,
      date,
      time,
      location,
      maxAttendees,
    } = req.body;

    event.title = title || event.title;
    event.description = description || event.description;
    event.category = category || event.category;
    event.date = date || event.date;
    event.time = time || event.time;
    event.location = location || event.location;
    event.maxAttendees = maxAttendees || event.maxAttendees;

    await event.save();

    res.json({ message: "Event updated successfully", event });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



export const toggleEventRegistration = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const userId = req.user._id;
    const isRegistered = event.attendees.includes(userId);

    if (isRegistered) {
      event.attendees.pull(userId);
    } else {
      if (event.attendees.length >= event.maxAttendees)
        return res.status(400).json({ message: "Event is full" });

      event.attendees.push(userId);
    }

    await event.save();

    res.json({
      registered: !isRegistered,
      attendees: event.attendees.length,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const toggleSaveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const userId = req.user._id;
    const isSaved = event.savedBy.includes(userId);

    if (isSaved) event.savedBy.pull(userId);
    else event.savedBy.push(userId);

    await event.save();

    res.json({
      saved: !isSaved,
      savedCount: event.savedBy.length,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    if (event.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    await event.deleteOne();

    res.json({ message: "Event deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};