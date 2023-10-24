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
  const { email } = req.query;

  if (email.length < 5) {
    return res.status(400).json({ error: "검색어는 최소 5자 이상이어야 합니다." });
  }

  const db = new sqlite3.Database("chat.db");

  db.all("SELECT * FROM users WHERE email LIKE ?", [`%${email}%`], (err, rows) => {
    if (err) {
      console.error("데이터베이스 오류:", err);
      return res.status(500).json({ error: "데이터베이스 오류" });
    }

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "검색 결과가 없습니다." });
    }

    const searchResults = rows.map(row => ({ id: row.id, email: row.email, username: row.username }));
    res.json(searchResults);

    createChatRoomsForUsers(searchResults);
  });
});

function createChatRoomsForUsers(users) {
  users.forEach(user => {
    const roomId = `room-${user.id}`;
    if (!chatRooms[roomId]) {
      chatRooms[roomId] = { users: [user.id], messages: [] };
    }
  });
}


//db.close();

const chatRooms = {};

app.use(express.json());

app.post("/createroom", (req, res) => {
  const { userId1, userId2 } = req.body;

  const roomId = `room-${userId1}-${userId2}`;
  if (chatRooms[roomId]) {
    return res.status(400).json({ error: "Room already exists" });
  }

  chatRooms[roomId] = { users: [userId1, userId2], messages: [] };
  res.json({ roomId });
});


io.on("connection", (socket) => {
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    if (!chatRooms[roomId]) {
      chatRooms[roomId] = { users: [], messages: [] };
    }
  });

  socket.on("message", (data) => {
    const roomId = data.roomId;
    if (!chatRooms[roomId]) {
      chatRooms[roomId] = { users: [], messages: [] };
    }
    chatRooms[roomId].messages.push(data);
    io.to(roomId).emit("message", data);
  });
});


const PORT = process.env.PORT || 3001;
http.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
