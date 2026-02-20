import Connection from "./connection.model.js";
import User from "../user/user.model.js";
import Notification from "../notification/notification.model.js";

export const sendConnectionRequest = async (req, res) => {
  try {
    const receiverId = req.params.userId;
    const requesterId = req.user.id;

    if (receiverId === requesterId) {
      return res.status(400).json({
        message: "You cannot connect with yourself"
      });
    }

    const existingConnection = await Connection.findOne({
      $or: [
        { requester: requesterId, receiver: receiverId },
        { requester: receiverId, receiver: requesterId }
      ]
    });

    if (existingConnection?.status === "accepted") {
      return res.status(400).json({
        message: "Already connected"
      });
    }

    if (existingConnection?.status === "pending") {
      return res.status(400).json({
        message: "Connection already pending"
      });
    }

    if (existingConnection?.status === "rejected") {
      await existingConnection.deleteOne();
    }

    const connection = await Connection.create({
      requester: requesterId,
      receiver: receiverId,
      status: "pending"
    });

    res.status(201).json({
      message: "Connection request sent",
      connection
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const respondToConnectionRequest = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const { action } = req.body;
    const userId = req.user.id;

    if (!["accept", "reject"].includes(action)) {
      return res.status(400).json({
        message: "Action must be accept or reject"
      });
    }

    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({
        message: "Connection request not found"
      });
    }

    if (connection.receiver.toString() !== userId) {
      return res.status(403).json({
        message: "Not authorized to respond to this request"
      });
    }

    if (connection.status !== "pending") {
      return res.status(400).json({
        message: "Connection already processed"
      });
    }

    if (action === "accept") {
      connection.status = "accepted";
      await connection.save();

      await Notification.create({
        recipient: connection.requester,
        sender: userId,
        type: "request_accepted", 
        message: "Your connection request was accepted"
      });

      return res.status(200).json({
        message: "Connection accepted",
        connection
      });
    }

    if (action === "reject") {
      connection.status = "rejected";
      await connection.save();

      await Notification.create({
        recipient: connection.requester,
        sender: userId,
        type: "request_rejected",
        message: "Your connection request was rejected"
      });

      return res.status(200).json({
        message: "Connection rejected"
      });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getMyConnections = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const connections = await Connection.find({
        status: "accepted",
        $or: [
          { requester: userId },
          { receiver: userId }
        ]
      })
        .populate("requester", "firstName lastName institute bio isPrivate")
        .populate("receiver", "firstName lastName institute bio isPrivate");
  
      res.status(200).json({ connections });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };
 
export const getPendingRequests = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const requests = await Connection.find({
        receiver: userId,
        status: "pending"
      })
      .populate(
        "requester",
        "firstName lastName avatar university major bio isPrivate"
      );
    
  
      res.status(200).json({ requests });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };
  

export const cancelConnectionRequest = async (req, res) => {
    try {
      const connectionId = req.params.connectionId;
  
      const connection = await Connection.findById(connectionId);
  
      if (!connection) {
        return res.status(404).json({ message: "Connection request not found" });
      }
  
      if (connection.requester.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to cancel this request" });
      }
  
      if (connection.status !== "pending") {
        return res.status(400).json({
          message: "Only pending requests can be cancelled"
        });
      }
  
      await connection.deleteOne();
  
      res.status(200).json({
        message: "Connection request cancelled"
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
export const removeConnection = async (req, res) => {
    try {
      const { connectionId } = req.params;
      const userId = req.user.id;
  
      const connection = await Connection.findById(connectionId);
  
      if (!connection) {
        return res.status(404).json({ message: "Connection not found" });
      }
  
      if (connection.status !== "accepted") {
        return res
          .status(400)
          .json({ message: "Only accepted connections can be removed" });
      }
  
      const isParticipant =
        connection.requester.toString() === userId ||
        connection.receiver.toString() === userId;
  
      if (!isParticipant) {
        return res
          .status(403)
          .json({ message: "Not authorized to remove this connection" });
      }
  
      await connection.deleteOne();
  
      res.status(200).json({
        message: "Connection removed successfully"
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };
  

  export const getConnectionStatus = async (req, res) => {
    try {
      const currentUserId = req.user.id;
      const targetUserId = req.params.userId;
  
      const connection = await Connection.findOne({
        $or: [
          { requester: currentUserId, receiver: targetUserId },
          { requester: targetUserId, receiver: currentUserId }
        ]
      });
  
      if (!connection) {
        return res.json({ status: "none" });
      }
  
      if (connection.status === "accepted") {
        return res.json({
          status: "connected",
          connectionId: connection._id
        });
      }
  
      if (connection.status === "pending") {
        if (connection.requester.toString() === currentUserId) {
          return res.json({
            status: "sent",
            connectionId: connection._id
          });
        } else {
          return res.json({
            status: "received",
            connectionId: connection._id
          });
        }
      }
  
      if (connection.status === "rejected") {
        return res.json({ status: "none" });
      }
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };
  