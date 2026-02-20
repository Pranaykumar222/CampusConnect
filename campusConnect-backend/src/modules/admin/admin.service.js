import User from "../user/user.model.js";
import Post from "../post/post.model.js";
import Project from "../project/project.model.js";
import Event from "../event/event.model.js";
import Resource from "../resource/resource.model.js";

export const getDashboardStats = async () => {
  const [users, posts, projects, events, resources] =
    await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      Project.countDocuments(),
      Event.countDocuments(),
      Resource.countDocuments(),
    ]);

  return { users, posts, projects, events, resources };
};

export const getAllUsers = async () => {
  return await User.find().select("-password");
};

export const deleteUser = async (userId) => {
  return await User.findByIdAndDelete(userId);
};

export const toggleBanUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) throw new Error("User not found");

  user.isBanned = !user.isBanned;
  await user.save();

  return user;
};


export const deletePost = async (id) =>
  await Post.findByIdAndDelete(id);

export const deleteProject = async (id) =>
  await Project.findByIdAndDelete(id);

export const deleteEvent = async (id) =>
  await Event.findByIdAndDelete(id);

export const deleteResource = async (id) =>
  await Resource.findByIdAndDelete(id);
