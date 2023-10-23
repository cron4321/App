const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3001;

app.use(cors());

const chatRoomsNamespace = io.of('/chat-rooms');

const chatRooms = [];

chatRoomsNamespace.on('connection', (socket) => {
  console.log('A user connected to chat rooms namespace');

  socket.emit('chat-rooms', chatRooms);

  socket.on('create-chat-room', ({ userId1, userId2 }) => {
    const existingRoom = chatRooms.find((room) =>
      room.userId1 === userId1 && room.userId2 === userId2
    );

    if (existingRoom) {
    } else {
      const newRoom = { userId1, userId2 };
      chatRooms.push(newRoom);

      chatRoomsNamespace.emit('chat-rooms', chatRooms);
    }
  });

  socket.on('get-chat-rooms', () => {
    socket.emit('chat-rooms', chatRooms);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected from chat rooms namespace');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
