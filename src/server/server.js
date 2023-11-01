require("dotenv").config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const webpush = require("web-push");
const bodyParser = require("body-parser");
const cheerio = require("cheerio");
const path = require("path");
const cron = require("node-cron");
const data = require("./UniList.json");
const Host = data.Uni1.Host;
const axios = require("axios");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'yeow1842@gmail.com',
    pass: 'iefi cwqt qbtt spav',
  },
});

const generateRandomVerificationCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const verificationCodes = new Map();
let db;

function connectToDatabase() {
  db = mysql.createConnection({
    host: '10.105.126.107',
    user: '2team',
    password: '1234',
    database: 'projectdb',
    port: 3306,
  });

  db.connect((err) => {
    if (err) {
      console.error('Database connection error:', err);
    } else {
      console.log('Connected to the database.');

      db.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255),
          password VARCHAR(255),
          username VARCHAR(255)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
      `);
    }
  });
}

connectToDatabase();

const secretKey = 'qwer';

app.use(session({
  secret: 'qwer',
  resave: false,
  saveUninitialized: true,
}));

app.post('/send-verification-email', (req, res) => {
  const { email } = req.body;
  const code = generateRandomVerificationCode();

  const mailOptions = {
    from: '우리 학교 알리미 회원가입',
    to: email,
    subject: '우리 학교 알리미 회원가입 인증 코드',
    text: `회원가입을 완료하려면 다음 인증 코드를 입력하세요: ${code}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Email error:', error);
      res.status(500).json({ error: '이메일 전송 오류' });
    } else {
      console.log('Email sent: ' + info.response);
      verificationCodes.set(email, code);
      res.status(200).json({ message: '이메일 전송 성공' });
    }
  });
});

app.post('/verify-verification-code', (req, res) => {
  const { email, code } = req.body;
  const storedCode = verificationCodes.get(email);

  if (code === storedCode) {
    res.status(200).json({ message: '인증 코드 확인됨' });
  } else {
    res.status(400).json({ error: '인증 코드 불일치' });
  }
});

app.post('/check-duplicate', async (req, res) => {
  const { email, username } = req.body;

  db.query('SELECT * FROM users WHERE email = ? OR username = ?', [email, username], (err, results) => {
    if (err) {
      console.error('Database error during duplicate check:', err);
      return res.status(500).json({ error: 'Database error during duplicate check' });
    }

    if (results.length > 0) {
      const existingEmail = results.some((row) => row.email === email);
      const existingUsername = results.some((row) => row.username === username);

      res.status(200).json({ emailExists: existingEmail, usernameExists: existingUsername });
    } else {
      res.status(200).json({ emailExists: false, usernameExists: false });
    }
  });
});

app.post('/signup', async (req, res) => {
  const { email, password, username } = req.body;

  db.beginTransaction((err) => {
    if (err) {
      console.error('Transaction error:', err);
      return res.status(500).json({ error: 'Transaction error' });
    }
    db.query('INSERT INTO users (email, password, username) VALUES (?, ?, ?)', 
                              [email, password, username], (err, results) => {
      if (err) {
        console.error('Database error during signup:', err);
        db.rollback();
        return res.status(500).json({ error: 'Database error during signup' });
      }

      db.commit((commitErr) => {
        if (commitErr) {
          console.error('Commit error:', commitErr);
          return res.status(500).json({ error: 'Commit error' });
        }
        
        console.log('Data Added');
        res.status(200).json({ message: '회원가입이 완료되었습니다.' });
      });
    });
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length > 0) {
      const row = results[0];
      console.log('로그인 성공. 사용자 정보:', row);

      const user = {
        id: row.id,
        email: email,
        username: row.username,
      };

      const token = jwt.sign(user, secretKey, { expiresIn: '1h' });

      res.status(200).json({ token, email, username: row.username });
    } else {
      console.error('로그인 실패: 이메일 또는 비밀번호가 잘못됨');
      res.status(400).json({ error: '이메일 또는 비밀번호가 잘못되었습니다.' });
    }
  });
});


app.get('/user', (req, res) => {
  const user = req.session.user;

  if (user) {
    res.status(200).json({
      email: user.email,
      username: user.username,
    });
  } else {
    res.status(404).json({ error: '사용자 정보를 찾을 수 없습니다.' });
  }
});

app.get('/current-user', (req, res) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: '사용자 인증이 필요합니다.' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(401).json({ error: '토큰이 유효하지 않습니다.' });
    }
  });
});

function requireLogin(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: '사용자 인증이 필요합니다.' });
  }

  jwt.verify(token.replace('Bearer ', ''), secretKey, (err, user) => {
    if (err) {
      return res.status(401).json({ error: '토큰이 유효하지 않습니다.' });
    }

    req.user = user;
    next();
  });
}

app.post('/logout', (req, res) => {
  req.session.user = null;
  res.status(200).json({ message: '로그아웃되었습니다.' });
});

const connection = mysql.createConnection({
  host: '10.105.126.107',
  user: '2team',
  password: '1234',
  database: 'projectdb',
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
  'CREATE TABLE IF NOT EXISTS messages (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255), message TEXT) ENGINE=InnoDB DEFAULT CHARSET=utf8;',
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

db.query(`
  CREATE TABLE IF NOT EXISTS memos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT, 
    title VARCHAR(255),
    content TEXT
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
`);

app.get('/api/memos', requireLogin, (req, res) => {
  const user = req.user;
  const sql = 'SELECT * FROM memos WHERE user_id = ?';
  connection.query(sql, [user.id], (err, results) => {
    if (err) {
      console.error('메모 데이터 가져오기 오류:', err);
      res.status(500).json({ error: '데이터 가져오기 오류' });
    } else {
      res.json(results);
    }
  });
});
app.post('/api/memos', requireLogin, (req, res) => {
  const user = req.user;
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: '제목과 내용은 필수입니다.' });
  }

  const sql = 'INSERT INTO memos (user_id, title, content) VALUES (?, ?, ?)';
  connection.query(sql, [user.id, title, content], (err, result) => {
    if (err) {
      console.error('메모 데이터 추가 오류:', err);
      return res.status(500).json({ error: '데이터 추가 오류' });
    } else {
      console.log('메모가 추가되었습니다.');
      res.json({ message: '메모가 추가되었습니다.', insertId: result.insertId });
    }
  });
});


app.put('/api/memos/:id', requireLogin, (req, res) => {
  const user = req.user;
  const id = parseInt(user.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: '올바르지 않은 ID' });
  }

  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: '제목과 내용은 필수입니다.' });
  }

  const sql = 'UPDATE memos SET title = ?, content = ? WHERE id = ? AND user_id = ?';
  connection.query(sql, [title, content, id, user.id], (err, result) => {
    if (err) {
      console.error('메모 데이터 수정 오류:', err);
      res.status(500).json({ error: '데이터 수정 오류' });
    } else {
      console.log('메모가 수정되었습니다.');
      res.json({ message: '메모가 수정되었습니다.' });
    }
  });
});

app.delete('/api/memos/:id', requireLogin, (req, res) => {
  const user = req.user;
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: '올바르지 않은 ID' });
  }

  const sql = 'DELETE FROM memos WHERE id = ? AND user_id = ?';
  connection.query(sql, [id, user.id], (err, result) => {
    if (err) {
      console.error('메모 데이터 삭제 오류:', err);
      res.status(500).json({ error: '데이터 삭제 오류' });
    } else {
      console.log('메모가 삭제되었습니다.');
      res.json({ message: '메모가 삭제되었습니다.' });
    }
  });
});

app.use((err, req, res, next) => {
  console.error('서버 오류:', err);
  res.status(500).json({ error: '서버 오류' });
});
  
db.query(`
  CREATE TABLE IF NOT EXISTS schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    school_name VARCHAR(255)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
`);

app.post('/select-school', requireLogin, (req, res) => {
  const user = req.user;
  const { schoolName } = req.body;
  const insertOrUpdateSchool = (user, schoolName) => {
    const sql = 'INSERT INTO schools (user_id, school_name) VALUES (?, ?) ON DUPLICATE KEY UPDATE school_name = ?';
    connection.query(sql, [user.id, schoolName, schoolName], (err, result) => {
      if (err) {
        console.error('학교 선택 오류:', err);
        res.status(500).json({ error: '학교 선택 오류' });
      } else {
        console.log('학교가 선택되었습니다.');
        res.json({ message: '학교가 선택되었습니다.' });
      }
    });
  };

  insertOrUpdateSchool(user, schoolName);
});

app.get('/selected-school', requireLogin, (req, res) => {
  const user = req.user;
  const sql = 'SELECT school_name FROM schools WHERE user_id = ?';
  connection.query(sql, [user.id], (err, results) => {
    if (err) {
      console.error('학교 정보 불러오기 오류:', err);
      res.status(500).json({ error: '학교 정보 불러오기 오류' });
    } else {
      if (results.length > 0) {
        const selectedSchool = results[0].school_name;
        res.json({ selectedSchool });
      } else {
        res.json({ selectedSchool: null });
      }
    }
  });
});

const results = [];
let previousTitles = [];

async function crawlPages() {
  const baseUrl = "https://www.snu.ac.kr/snunow/notice/genernal";
  const maxResults = 15; 

  try {
    for (let currentPage = 1; results.length < maxResults; currentPage++) {
      const url = `${baseUrl}?page=${currentPage}`;
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);

      const elements = $("table tbody tr");

      if (elements.length === 0) {
        break;
      }

      elements.each((index, element) => {
        if (results.length < maxResults) {
          const elementData = {
            title: cleanText(
              $(element).find("td.col-title a span span").text()
            ),
            link: `https://${Host}${$(element)
              .find("td.col-title a")
              .attr("href")}`,
            date: cleanText($(element).find("td.col-date").text()),
          };
          results.unshift(elementData);
        }
      });
    }
    PushNotifications();

    app.get("/data", (req, res) => {
      res.json(results);
    });
  } catch (error) {
    console.error("크롤링 중 오류 발생:", error);
  }
}


const port = process.env.PORT || 3002;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
  
function cleanText(text) {
  return text.replace(/\n/g, "").replace(/\s+/g, " ").trim();
}

function PushNotifications() {
  const changedTitles = getChangedTitles(
    previousTitles,
    results.map((item) => item.title)
  );

  if (changedTitles.length > 0) {
    sendPushNotifications(changedTitles);
  }

  previousTitles = results.map((item) => item.title);
}

function getChangedTitles(previousTitles, newTitles) {
  const changedTitles = [];

  for (const newTitle of newTitles) {
    if (!previousTitles.includes(newTitle)) {
      changedTitles.push(newTitle);
    }
  }

  return changedTitles;
}

crawlPages();

cron.schedule("*/10 * * * *", () => {
  crawlPages();
  console.log("crawling");
});

if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  console.log(
    "You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY " +
      "environment variables. You can use the following ones:"
  );
  console.log(webpush.generateVAPIDKeys());
  return;
}

webpush.setVapidDetails(
  "mailto:your@email.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

app.get("/vapidPublicKey", function (req, res) {
  res.send(process.env.VAPID_PUBLIC_KEY);
});

app.post("/register", function (req, res) {
  res.sendStatus(201);
});

function sendPushNotifications() {
  console.log("success");
  app.post("/sendNotification", function (req, res) {
    const subscription = req.body.subscription;
    const payload = results[0].title;
    webpush
      .sendNotification(subscription, payload)
      .then(function () {
        res.sendStatus(201);
      })
      .catch(function (error) {
        console.log(error);
        res.sendStatus(500);
      });
  });
}
