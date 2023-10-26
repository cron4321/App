const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); 

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());

let clientCount = 0;

io.on('connection', (socket) => {
  console.log('Client connected');
  
  clientCount++;
  const clientName = `익명${clientCount}`; 

  socket.emit('clientName', clientName); 

  socket.on('message', (message) => {
    console.log(`Received message from ${clientName}: ${message}`);
    io.emit('message', `${clientName}: ${message}`); 
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${clientName}`);
  });
});

const port = process.env.PORT || 3004;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
