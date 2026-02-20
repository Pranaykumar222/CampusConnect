import express from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import connectionRoutes from "./modules/user/connection.routes.js";
import followRoutes from "./modules/user/follow.routes.js";
import notificationRoutes from "./modules/notification/notification.routes.js"
import discoverRoutes from "./modules/user/discover.routes.js"
import messageRoutes from "./modules/messaging/message.routes.js"
import groupRoutes from "./modules/messaging/group-chat.routes.js";
import chatRoutes from "./modules/messaging/chat.routes.js"
import communityRoutes from "./modules/post/post.routes.js";
import eventRoutes from "./modules/event/event.routes.js";
import projectRoutes from "./modules/project/project.routes.js";
import resourceRoutes from "./modules/resource/resource.routes.js";

import adminRoutes from "./modules/admin/admin.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";

import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200, 
    message: "Too many requests, slow down",
  });


const app = express();

app.set("trust proxy", 1);

app.use(express.json());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const allowed =
        origin === "https://campusconnect1-three.vercel.app" ||
        origin.endsWith(".vercel.app") ||
        origin.includes("localhost");

      if (allowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);



  app.use(
    helmet({
      crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    })
  );
  
  

app.use(limiter);


app.get("/health", (req, res) => {
    res.json({
      status: "ok",
      uptime: process.uptime(),
    });
  });

app.use("/api/auth", authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/discover", discoverRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/chats", groupRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/resources", resourceRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/admin", adminRoutes);



import { errorHandler } from "./middleware/error.middleware.js";
app.use(errorHandler);

export default app;