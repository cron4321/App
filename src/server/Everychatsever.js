const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mysql = require('mysql2'); 

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'test',
  password: '0000',
  database: 'testdb',
  port: 3306,
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
  } else {
    console.log('Connected to MySQL database');
  }
});

connection.query(
  'CREATE TABLE IF NOT EXISTS messages (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255), message TEXT)',
  (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Table created');
    }
  }
);

let clientCount = 0;

io.on('connection', (socket) => {
  clientCount++;
  const clientName = `익명${clientCount}`;

  console.log(`Client connected: ${clientName}`);
  
  socket.emit('clientName', clientName);

  connection.query('SELECT * FROM messages', (err, results) => {
    if (!err) {
      socket.emit('initialMessages', results);
    }
  });

  socket.on('message', (data) => {
    const { username, message } = data;

    connection.query('INSERT INTO messages (username, message) VALUES (?, ?)', [username, message], (err, results) => {
      if (err) {
        console.error('Error inserting into MySQL:', err.message);
      } else {
        console.log(`Message saved: ${message}`);
        console.log(`username saved: ${username}`);
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
