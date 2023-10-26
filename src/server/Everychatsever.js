const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose(); 

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());

const db = new sqlite3.Database('chat.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the chat database');
  }
});

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, username TEXT, message TEXT)', (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Table created');
    }
  });
});

let clientCount = 0;

io.on('connection', (socket) => {
  clientCount++;
  const clientName = `익명${clientCount}`;

  console.log(`Client connected: ${clientName}`);
  
  socket.emit('clientName', clientName);

  db.all('SELECT * FROM messages', (err, rows) => {
    if (!err) {
      socket.emit('initialMessages', rows);
    }
  });

  socket.on('message', (data) => {
    const { username, message } = data;

    db.run('INSERT INTO messages (username, message) VALUES (?, ?)', [username, message], (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log(`Message saved: ${message}`);
        console.log(`username save: ${username}`);
      }
    });

    io.emit('message', `${username}: ${message}`);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${clientName}`);
  });
});

const port = process.env.PORT || 3004;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
