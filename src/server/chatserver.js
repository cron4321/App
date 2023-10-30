const express = require("express");
const app = express();
const http = require("http").createServer(app);
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET,POST",
}));

const io = require("socket.io")(http, {
  path: '/socket.io',
  serveClient: false, 
  cookie: false, 
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  }
});

app.get("/search", (req, res) => {
  const { username } = req.query;

  const db = new sqlite3.Database("chat.db");

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
    db.close((closeErr) => {
      if (closeErr) {
        console.error('Error closing database:', closeErr);
      }
    });

    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (!row) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ id: row.id, username: row.username });
  });
});


//db.close();

const chatRooms = {};

app.use(express.json());

app.post("/createroom", (req, res) => {
  const { userId1, userId2 } = req.body;

  const roomId = `room-${userId1}-${userId2}`;
  chatRooms[roomId] = { users: [userId1, userId2], messages: [] };
  res.json({ roomId });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
  });

  socket.on("message", (data) => {
    const roomId = data.roomId;
    chatRooms[roomId].messages.push(data);
    io.to(roomId).emit("message", data);
  });
});

const PORT = process.env.PORT || 3001;
http.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
