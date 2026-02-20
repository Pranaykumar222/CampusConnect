import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    type: {
      type: String,
      enum: [
        "connection_request",
        "request_accepted",
        "request_rejected",
        "new_follower",

       
        "post_like",
        "post_comment",

      
        "new_message",

       
        "event_invite",
        "project_invite",
      ],
      required: true,
    },

   
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    message: {
      type: String,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
