import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routers/authRoute.js";
import messageRoutes from "./routers/messageRoute.js";
import path from "path";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";

dotenv.config();

const __dirname = path.resolve();

const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10mb" })); // req.body
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production" ? true : process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.use((req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

server.listen(PORT, () => {
  console.log("server running on PORT:" + PORT);
  connectDB();
});
