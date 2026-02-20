import User from "../user/user.model.js";
import Post from "../post/post.model.js";
import Event from "../event/event.model.js";
import Project from "../project/project.model.js";
import Message from "../messaging/message.model.js";
import Chat from "../messaging/chat.model.js";
import Connection from "../user/connection.model.js";


export const getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user._id;

    const connectionsCount = await Connection.countDocuments({
      $or: [
        { requester: userId, status: "accepted" },
        { receiver: userId, status: "accepted" },
      ],
    });

    const eventsCount = await Event.countDocuments({
      attendees: userId,
    });

    const projectsCount = await Project.countDocuments({
        contributors: userId
      });
      

    const userChats = await Chat.find({
      participants: userId
    }).select("_id");

    const chatIds = userChats.map(chat => chat._id);

    const messagesCount = await Message.countDocuments({
      chat: { $in: chatIds },
      sender: { $ne: userId },
      readBy: { $ne: userId },
    });



    const recentPosts = await Post.find()
  .sort({ createdAt: -1 })
  .limit(5)
  .populate("author", "firstName lastName department");

  
    const upcomingEvents = await Event.find({
      date: { $gte: new Date() },
    })
      .sort({ date: 1 })
      .limit(5);


    const connections = await Connection.find({
      $or: [
        { requester: userId, status: "accepted" },
        { receiver: userId, status: "accepted" },
      ],
    });

    const connectedUserIds = connections.map((c) =>
      c.requester.toString() === userId.toString()
        ? c.receiver
        : c.requester
    );

    const peopleYouMayKnow = await User.find({
      _id: { $nin: [...connectedUserIds, userId] },
    })
      .limit(5)
      .select("firstName lastName department");

    res.json({
      counts: {
        connectionsCount,
        eventsCount,
        projectsCount,
        messagesCount,
      },
      recentPosts,
      upcomingEvents,
      peopleYouMayKnow,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

