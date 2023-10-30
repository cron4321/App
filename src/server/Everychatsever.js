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
  host: '52.78.105.126',
  user: '2team',
  password: '1234',
  database: 'projectdb',
  port: 31212,
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

app.get('/getClientName', (req, res) => {
  clientCount++;
  const clientName = `익명${clientCount}`;
  res.json({ clientName });
});

app.get('/getInitialMessages', (req, res) => {
  connection.query('SELECT * FROM messages', (err, results) => {
    if (!err) {
      const messages = results.map((row) => `${row.username}: ${row.message}`);
      res.json({ messages });
    } else {
      res.status(500).json({ error: '초기 채팅 내용을 가져오는 중 오류가 발생했습니다.' });
    }
  });
});

io.on('connection', (socket) => {
  const clientName = `익명${clientCount}`;

  console.log(`Client connected: ${clientName}`);
  
  socket.emit('clientName', clientName);

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
