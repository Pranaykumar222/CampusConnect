import User from "./user.model.js";
import Connection from "./connection.model.js";
import bcrypt from "bcryptjs";

const calculateProfileCompletion = (user) => {
  return Boolean(
    user.bio?.trim() &&
    user.avatar?.trim() &&
    Array.isArray(user.skills) &&
    user.skills.length > 0
  );
};

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({ success: true, user });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const allowedFields = [
      "firstName",
      "lastName",
      "university",
      "major",
      "academicYear",
      "bio",
      "skills",
      "interests",
      "location",
      "socialLinks",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    let user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    Object.assign(user, updates);

    user.profileCompleted = calculateProfileCompletion(user);

    await user.save();

    res.json({
      success: true,
      message: "Profile updated",
      user,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};


export const getUsers = async (req, res) => {
  try {
    const { search, skill, university, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const query = { _id: { $ne: req.user.id } };

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { skills: { $elemMatch: { $regex: search, $options: "i" } } },
      ];
    }

    if (skill) {
      query.skills = { $elemMatch: { $regex: skill, $options: "i" } };
    }

    if (university) {
      query.university = { $regex: university, $options: "i" };
    }

    const users = await User.find(query)
      .select("-password")
      .skip(skip)
      .limit(Number(limit))
      .sort({ firstName: 1 });

    const total = await User.countDocuments(query);

    const connections = await Connection.find({
      status: "accepted",
      $or: [
        { requester: req.user.id },
        { receiver: req.user.id },
      ],
    }).select("requester receiver");

    const connectedUserIds = new Set(
      connections.map((conn) =>
        conn.requester.toString() === req.user.id
          ? conn.receiver.toString()
          : conn.requester.toString()
      )
    );

    const formattedUsers = users.map((user) => {
      if (!user.isPrivate) return user;

      if (connectedUserIds.has(user._id.toString())) {
        return user;
      }

      return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        university: user.university,
        bio: user.bio,
        isPrivate: true,
      };
    });

    res.json({
      success: true,
      users: formattedUsers,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isPrivate || user._id.toString() === req.user.id) {
      return res.json({ success: true, user });
    }

    const isConnected = await Connection.exists({
      status: "accepted",
      $or: [
        { requester: req.user.id, receiver: user._id },
        { requester: user._id, receiver: req.user.id },
      ],
    });

    if (isConnected) {
      return res.json({ success: true, user });
    }

    return res.json({
      success: true,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        university: user.university,
        bio: user.bio,
        isPrivate: true,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const updatePrivacy = async (req, res) => {
  try {
    const { isPrivate } = req.body;

    if (typeof isPrivate !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Invalid privacy value",
      });
    }

    const user = await User.findById(req.user.id);

    user.isPrivate = isPrivate;
    await user.save();

    res.json({
      success: true,
      message: "Privacy updated",
      user,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const getProfileStats = async (req, res) => {
  try {
    const profileUserId = req.params.id;
    const viewerId = req.user.id;

    const user = await User.findById(profileUserId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isPrivate && profileUserId !== viewerId) {
      const isConnected = await Connection.exists({
        status: "accepted",
        $or: [
          { requester: viewerId, receiver: profileUserId },
          { requester: profileUserId, receiver: viewerId },
        ],
      });

      if (!isConnected) {
        return res.status(403).json({
          success: false,
          message: "Profile is private",
        });
      }
    }

    const connectionsCount = await Connection.countDocuments({
      status: "accepted",
      $or: [
        { requester: profileUserId },
        { receiver: profileUserId },
      ],
    });

    res.json({
      success: true,
      followers: connectionsCount,
      following: connectionsCount,
      connections: connectionsCount,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const user = await User.findById(req.user.id);

    user.avatar = req.file.path;
    user.profileCompleted = calculateProfileCompletion(user);

    await user.save();

    res.json({
      success: true,
      message: "Avatar updated",
      user,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
};


export const uploadBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const user = await User.findById(req.user.id);

    user.bannerImage = req.file.path;
    await user.save();

    res.json({
      success: true,
      message: "Banner updated",
      user,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
};


export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });
    }

    const user = await User.findById(req.user.id).select("+password");

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password incorrect"
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


export const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);

    res.json({
      success: true,
      message: "Account deleted successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
