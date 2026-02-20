import User from "./user.model.js";

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: req.file.path },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Avatar updated",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Upload failed",
    });
  }
};

export const uploadBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { bannerImage: req.file.path },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Banner updated",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Upload failed",
    });
  }
};
