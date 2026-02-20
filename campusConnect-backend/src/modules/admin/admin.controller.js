import * as adminService from "./admin.service.js";

export const dashboardStats = async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();

    res.json({ success: true, data: stats });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();

    res.json({ success: true, data: users });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

export const removeUser = async (req, res) => {
  try {
    await adminService.deleteUser(req.params.id);

    res.json({
      success: true,
      message: "User deleted",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};

export const banUser = async (req, res) => {
  try {
    const user = await adminService.toggleBanUser(
      req.params.id
    );

    res.json({
      success: true,
      message: user.isBanned
        ? "User banned"
        : "User unbanned",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* Content moderation */

export const removePost = async (req, res) => {
  await adminService.deletePost(req.params.id);
  res.json({ success: true, message: "Post deleted" });
};

export const removeProject = async (req, res) => {
  await adminService.deleteProject(req.params.id);
  res.json({ success: true, message: "Project deleted" });
};

export const removeEvent = async (req, res) => {
  await adminService.deleteEvent(req.params.id);
  res.json({ success: true, message: "Event deleted" });
};

export const removeResource = async (req, res) => {
  await adminService.deleteResource(req.params.id);
  res.json({
    success: true,
    message: "Resource deleted",
  });
};
