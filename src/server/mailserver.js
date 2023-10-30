const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'yeow1842@gmail.com', // 발신자 이메일
    pass: 'iefi cwqt qbtt spav', // 앱 비밀번호
  },
});

const generateRandomVerificationCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const verificationCodes = new Map();

let db;

function connectToDatabase() {
  db = new sqlite3.Database('chat.db', (err) => {
    if (err) {
      console.error('Database connection error:', err);
    } else {
      console.log('Connected to the database.');

      db.run('CREATE TABLE IF NOT EXISTS nowloginid (email TEXT, username TEXT)');
      db.run('CREATE TABLE IF NOT EXISTS nowloginsuc (status BOOLEAN)');
    }
  });
}

connectToDatabase();


db.serialize(function () {
  db.run(
    'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT, username TEXT)'
  );
});

app.post('/send-verification-email', (req, res) => {
  const { email } = req.body;
  const code = generateRandomVerificationCode();

  const mailOptions = {
    from: 'yeow1842@gmail.com',
    to: email,
    subject: '회원가입 인증 코드',
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

app.post('/signup', async (req, res) => {
  const { email, password, username } = req.body;

  db.run('BEGIN TRANSACTION', (beginErr) => {
    if (beginErr) {
      console.error("Transaction error:", beginErr);
      return res.status(500).json({ error: "Transaction error" });
    }

    db.run("INSERT INTO users (email, password, username) VALUES (?, ?, ?)", [email, password, username], function (err) {
      if (err) {
        console.error("Database error:", err);
        db.run('ROLLBACK'); 
        return res.status(500).json({ error: "Database error" });
      }

      db.run('COMMIT', (commitErr) => {
        if (commitErr) {
          console.error("Commit error:", commitErr);
          return res.status(500).json({ error: "Commit error" });
        }

        console.log("Data Added");
        res.status(200).json({ message: "회원가입이 완료되었습니다." });
      });
    });
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (row) {
      console.log('로그인 성공. 사용자 정보:', row);

      db.run('CREATE TABLE IF NOT EXISTS nowloginid (email TEXT, username TEXT)');
      db.run('DELETE FROM nowloginid');  
      const insertUser = db.prepare('INSERT INTO nowloginid (email, username) VALUES (?, ?)');
      insertUser.run(email, row.username);  
      insertUser.finalize();

      db.run('CREATE TABLE IF NOT EXISTS nowloginsuc (status BOOLEAN)');
      db.run('DELETE FROM nowloginsuc');  
      const insertStatus = db.prepare('INSERT INTO nowloginsuc (status) VALUES (?)');
      insertStatus.run(true);
      insertStatus.finalize();

      res.status(200).json({ user: row });
    } else {
      console.error('로그인 실패: 이메일 또는 비밀번호가 잘못됨');
      res.status(400).json({ error: '이메일 또는 비밀번호가 잘못되었습니다.' });
    }
  });
});


app.post('/logout', (req, res) => {
  db.serialize(function () {
    db.run('CREATE TABLE IF NOT EXISTS nowloginid (email TEXT, password TEXT)');
    db.run('DELETE FROM nowloginid');
    db.run('DELETE FROM nowloginsuc');
  });

  res.status(200).json({ message: '로그아웃되었습니다.' });
});

app.get('/user', (req, res) => {
  db.get('SELECT email, username FROM nowloginid', (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (row) {
      res.status(200).json(row);
    } else {
      res.status(404).json({ error: '사용자 정보를 찾을 수 없습니다.' });
    }
  });
});


const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`서버가 ${port} 포트에서 실행 중입니다.`);
});
