// server.ts
import express from "express";
import http from "http";
import { Server } from "socket.io";
// import cors from "cors";

const app = express();

// Enable JSON parsing
app.use(express.json());

// Optional: REST API endpoints
app.get("/api/test", (req, res) => res.json({ message: "Server working" }));

// Create HTTP server
const server = http.createServer(app);

// Socket.IO setup with CORS
const io = new Server(server, {
  cors: {
    origin: "https://courier-and-parcel-management-syste-six.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("joinParcel", (parcelId) => {
    socket.join(parcelId);
    console.log("Joined parcel room:", parcelId);
  });

  socket.on("updateParcel", (parcel) => {
    console.log("Parcel update:", parcel);
    io.to(parcel._id).emit("parcelUpdate", parcel);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start server
server.listen(4000, () => console.log("Socket.IO server running on port 4000"));
