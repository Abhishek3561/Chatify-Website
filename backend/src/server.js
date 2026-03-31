import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import dotenv from "dotenv/config";

import authRoutes from "./routers/authRoute.js";
import messageRoutes from "./routers/messageRoute.js";
import { connectDB } from "./lib/db.js";

import { app, server } from "./lib/socket.js";

const __dirname = path.resolve();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

// IMPORTANT: allow multiple origins (Render + local dev safe)
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ✅ FIX: ALWAYS serve frontend (not conditional)
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// optional root route (good for testing API)
app.get("/", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

// server start
server.listen(PORT, () => {
  console.log("Server running on port: " + PORT);
  connectDB();
});
