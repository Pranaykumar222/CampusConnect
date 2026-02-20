import "dotenv/config"
import http from "http";
import app from "./src/app.js";
import { initSocket } from "./src/socket.js";
import connectDB from "./src/config/db.js";


connectDB();

const PORT = process.env.PORT || 5123;

const server = http.createServer(app);

initSocket(server);

server.listen(PORT);