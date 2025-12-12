import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

interface Parcel {
  _id: string;
  currentLocation: { lat: number; lng: number };
  status: string;
}

const app = express();

// Enable JSON request body parsing
app.use(express.json());

// CORS config (reads from .env)
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Next.js frontend
    credentials: true,
  })
);

const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

// Track connected clients
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Listen for parcel updates from delivery agents
  socket.on("updateParcel", (parcel: Parcel) => {
    console.log("Parcel update received:", parcel);

    // Broadcast to all customers
    io.emit("parcelUpdate", parcel);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Test endpoint
app.get("/", (req, res) => {
  res.send("Courier management Socket.IO server is running 🚀");
});

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
