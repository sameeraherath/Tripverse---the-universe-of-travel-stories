require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const connectDb = require("./config/db");
const postRoutes = require("./routes/postRoutes");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const commentRoutes = require("./routes/commentRoutes");
const aiRoutes = require("./routes/aiRoutes");
const chatRoutes = require("./routes/chatRoutes");
const adminRoutes = require("./routes/adminRoutes");
const faqRoutes = require("./routes/faqRoutes");
const discoverRoutes = require("./routes/discoverRoutes");

// Connect to MongoDB
(async () => {
  try {
    await connectDb();
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
})();

const app = express();
const server = http.createServer(app);

// Define allowed origins from environment or default
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5000",
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
  ...(process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : []),
];

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 requests per window
  message: "Upgrade to the Pro version for more requests per hour.",
});

const discoverLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests. Please try again later.",
});

// CORS configuration with error handling
app.use((req, res, next) => {
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })(req, res, (err) => {
    if (err) {
      console.error("CORS Error:", err);
      return res.status(500).json({ message: "CORS error occurred" });
    }
    next();
  });
});

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Routes
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/ai", aiLimiter, aiRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/discover", discoverLimiter, discoverRoutes);

// 404 handler
app.use((req, res) => {
  console.log(`404 - Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: "Route not found" });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Error:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Socket.IO middleware for authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication error"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    next();
  } catch (error) {
    next(new Error("Authentication error"));
  }
});

// Store online users
const onlineUsers = new Map();

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.userId}`);

  // Add user to online users
  onlineUsers.set(socket.userId, socket.id);

  // Broadcast online status
  io.emit("user:online", { userId: socket.userId });

  // Join user's personal room
  socket.join(socket.userId);

  // Handle joining chat room
  socket.on("chat:join", (chatId) => {
    socket.join(`chat:${chatId}`);
    console.log(`User ${socket.userId} joined chat ${chatId}`);
  });

  // Handle leaving chat room
  socket.on("chat:leave", (chatId) => {
    socket.leave(`chat:${chatId}`);
    console.log(`User ${socket.userId} left chat ${chatId}`);
  });

  // Handle sending message
  socket.on("message:send", (data) => {
    const { chatId, message } = data;

    // Broadcast to all users in the chat room
    io.to(`chat:${chatId}`).emit("message:receive", {
      chatId,
      message,
    });
  });

  // Handle typing indicator
  socket.on("typing:start", (data) => {
    const { chatId, userId } = data;
    socket.to(`chat:${chatId}`).emit("typing:start", { chatId, userId });
  });

  socket.on("typing:stop", (data) => {
    const { chatId, userId } = data;
    socket.to(`chat:${chatId}`).emit("typing:stop", { chatId, userId });
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.userId}`);
    onlineUsers.delete(socket.userId);

    // Broadcast offline status
    io.emit("user:offline", { userId: socket.userId });
  });
});

// Make io accessible to routes
app.set("io", io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

// Handle server errors
server.on("error", (error) => {
  console.error("Server error:", error);
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use`);
    process.exit(1);
  }
});
