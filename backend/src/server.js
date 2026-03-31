import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import dotenv from "dotenv/config"
import authRoutes from "./routers/authRoute.js";
import messageRoutes from "./routers/messageRoute.js";
import { connectDB } from "./lib/db.js";

import { app, server } from "./lib/socket.js";

const __dirname = path.resolve();

const PORT = process.env.PORT || 10000;

app.use(express.json({ limit: "5mb" })); // req.body
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// make ready for deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
}

server.listen(PORT, () => {
  console.log("Server running on port: " + PORT);
  connectDB();
});
