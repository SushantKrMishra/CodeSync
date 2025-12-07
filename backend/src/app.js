import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/database.js";
import { userAuthMiddleware } from "./middlewares/userAuth.js";
import chatRoutes from "./routes/chatRoutes.js";
import connectionRoutes from "./routes/connectionRoutes.js";
import engageRoutes from "./routes/engageRoutes.js";
import feedRoutes from "./routes/feedRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import userAuthRoutes from "./routes/userAuthRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { setupSocket } from "./socket.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5001;
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174","https://dev-code-sync.vercel.app"];

const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/open", userAuthRoutes);
app.use("/images", userAuthMiddleware, express.static("images"));
app.use("/api", userAuthMiddleware, userRoutes);
app.use("/connection", userAuthMiddleware, connectionRoutes);
app.use("/feed", userAuthMiddleware, feedRoutes);
app.use("/engage", userAuthMiddleware, engageRoutes);
app.use("/chatRoom", userAuthMiddleware, chatRoutes);
app.use("/message", userAuthMiddleware, messageRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// Connect to DB and start server
connectDB()
  .then(() => {
    console.log("Connected to DB");
    setupSocket(io);
    server.listen(port, () => {
      console.log(`Server is listening on ${port}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to DB:", err);
  });
