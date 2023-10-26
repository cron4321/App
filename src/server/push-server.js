require("dotenv").config();
const webpush = require("web-push");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const port = 4001;
const app = express();
const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

//웹 푸시 설정 (VAPID 키 필요)
webpush.setVapidDetails(
  "mailto:your@email.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);


// 푸시 알림 구독 엔드포인트
app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  res.status(201).json({});

  // 실제로 푸시 알림을 보내는 로직
  const payload = JSON.stringify({
    title: pushTitle,
    body: "Push Notification",
  });
  res.status(201).json({});
  
  webpush.sendNotification(subscription, payload).catch((error) => {
    console.error("푸시 알림 보내기 오류:", error);
  });
});

app.listen(port, () => {
  console.log(`서버가 ${port} 포트에서 실행 중입니다.`);
});
