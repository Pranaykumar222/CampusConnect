import Follow from "./follow.model.js";
import User from "./user.model.js";
import Connection from "./connection.model.js";
import Notification from "../notification/notification.model.js";

export const followUser = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.userId;

    if (followerId === followingId) {
      return res.status(400).json({
        message: "You cannot follow yourself"
      });
    }

    const userToFollow = await User.findById(followingId);
    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userToFollow.isPrivate) {
      const existingConnection = await Connection.findOne({
        requester: followerId,
        receiver: followingId
      });

      if (existingConnection) {
        return res.status(400).json({
          message: "Connection request already sent"
        });
      }

      const connection = await Connection.create({
        requester: followerId,
        receiver: followingId,
        status: "pending"
      });

      await Notification.create({
        recipient: followingId,
        sender: followerId,
        type: "connection_request",
        message: "sent you a connection request"
      });

      return res.status(200).json({
        message: "Private account — connection request sent",
        connection
      });
    }

    const follow = await Follow.create({
      follower: followerId,
      following: followingId
    });

    await Notification.create({
      recipient: followingId,
      sender: followerId,
      type: "new_follower",
      message: "started following you"
    });

    res.status(201).json({
      message: "User followed successfully",
      follow
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Already following this user"
      });
    }

    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const unfollowUser = async (req, res) => {
    try {
      const followerId = req.user._id;     
      const followingId = req.params.userId; 
  
      const deleted = await Follow.findOneAndDelete({
        follower: followerId,
        following: followingId
      });
  
      if (!deleted) {
        return res.status(400).json({
          message: "You are not following this user"
        });
      }
  
      res.status(200).json({
        message: "Unfollowed successfully"
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  export const getFollowStats = async (req, res) => {
    try {
      const userId = req.params.userId;
  
      const followers = await Follow.countDocuments({
        following: userId
      });
  
      const following = await Follow.countDocuments({
        follower: userId
      });
  
      const connections = await Connection.countDocuments({
        status: "accepted",
        $or: [
          { requester: userId },
          { receiver: userId }
        ]
      });
  
      res.status(200).json({
        followers,
        following,
        connections
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };
  

export const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;

    const followers = await Follow.find({ following: userId })
      .populate("follower", "firstName lastName avatar university major")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: followers.length,
      followers: followers.map(f => f.follower)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;

    const following = await Follow.find({ follower: userId })
      .populate("following", "firstName lastName avatar university major")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: following.length,
      following: following.map(f => f.following)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getRelationshipStatus = async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user.id;

    const connection = await Connection.findOne({
      $or: [
        { requester: currentUserId, receiver: targetUserId },
        { requester: targetUserId, receiver: currentUserId }
      ]
    });

    if (!connection) {
      return res.json({
        isConnected: false,
        isRequested: false
      });
    }

    if (connection.status === "accepted") {
      return res.json({
        isConnected: true,
        isRequested: false
      });
    }

    if (connection.status === "pending") {
      return res.json({
        isConnected: false,
        isRequested: true,
        requestedByMe: connection.requester.toString() === currentUserId
      });
    }

    return res.json({
      isConnected: false,
      isRequested: false
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
