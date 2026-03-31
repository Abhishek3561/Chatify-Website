import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routers/authRoute.js";
import messageRoutes from "./routers/messageRoute.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

// IMPORTANT for Render + cookies
app.set("trust proxy", 1);

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// CORS (frontend URL from Vercel)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://chatify-website-k1j2oyz80-abhishek3561s-projects.vercel.app",
    ],
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Test route (optional)
app.get("/", (req, res) => {
  res.send("Backend is running");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
  connectDB();
});

console.log("MONGO_URI:", process.env.MONGO_URI);