const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

app.use(cors());

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'yeow1842@gmail.com', // 발신자 이메일
    pass: 'iefi cwqt qbtt spav', // 앱 비밀번호
  },
});

app.use(bodyParser.json());

const generateRandomVerificationCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const verificationCodes = new Map();

app.post('/send-verification-email', (req, res) => {
  const { email } = req.body;
  const code = generateRandomVerificationCode();

  const mailOptions = {
    from: 'yeow1842@gmail.com', // 발신자
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

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`서버가 ${port} 포트에서 실행 중입니다.`);
});
