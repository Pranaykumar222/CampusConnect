import Chat from "./chat.model.js";
import Message from "./message.model.js";


export const createGroup = async (req, res) => {
  const { name, participants } = req.body;

  if (!name || !participants || participants.length < 2) {
    return res.status(400).json({ message: "Minimum 3 users required" });
  }

  const group = await Chat.create({
    name,
    type: "group",
    participants: [...participants, req.user._id],
    admin: req.user._id,
  });

  const fullGroup = await Chat.findById(group._id)
    .populate("participants", "-password")
    .populate("admin", "-password");

  res.status(201).json(fullGroup);
};


export const renameGroup = async (req, res) => {
  const { name } = req.body;
  const group = await Chat.findById(req.params.id);

  if (!group) return res.status(404).json({ message: "Not found" });

  if (group.admin.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Only admin allowed" });

  group.name = name;
  await group.save();

  const updated = await Chat.findById(group._id)
    .populate("participants", "-password")
    .populate("admin", "-password");

  res.json(updated);
};


export const addToGroup = async (req, res) => {
  const { userId } = req.body;

  const group = await Chat.findById(req.params.id);

  if (!group) return res.status(404).json({ message: "Not found" });

  if (group.admin.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Only admin allowed" });

  if (!group.participants.includes(userId)) {
    group.participants.push(userId);
    await group.save();
  }

  const updated = await Chat.findById(group._id)
    .populate("participants", "-password")
    .populate("admin", "-password");

  res.json(updated);
};


export const removeFromGroup = async (req, res) => {
  const { userId } = req.body;

  const group = await Chat.findById(req.params.id);

  if (!group) return res.status(404).json({ message: "Not found" });

  if (
    group.admin.toString() !== req.user._id.toString() &&
    userId !== req.user._id.toString()
  )
    return res.status(403).json({ message: "Not allowed" });

  group.participants = group.participants.filter(
    (p) => p.toString() !== userId
  );

  await group.save();

  const updated = await Chat.findById(group._id)
    .populate("participants", "-password")
    .populate("admin", "-password");

  res.json(updated);
};


export const deleteGroup = async (req, res) => {
  const group = await Chat.findById(req.params.id);

  if (!group) return res.status(404).json({ message: "Not found" });

  if (group.admin.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Only admin can delete" });

  await Message.deleteMany({ chat: group._id });
  await group.deleteOne();

  res.json({ message: "Group deleted" });
};
