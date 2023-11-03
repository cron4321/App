require("dotenv").config();
const webpush = require("web-push");
const bodyParser = require("body-parser");
const cheerio = require("cheerio");
const axios = require("axios");
const cors = require("cors");
const express = require("express");
const path = require("path");
const cron = require("node-cron");
const mysql = require("mysql2");

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

let previousResults = [];
const subscriptions = [];
const results = [];
let newPush = [];

// const connection = mysql.createConnection({
//   host: "127.0.0.1",
//   user: "testuser1",
//   password: "1234",
//   database: "test_db",
//   port: 3306,
// });

// connection.connect((err) => {
//   if (err) {
//     console.error("Error connecting to MySQL:", err.message);
//   } else {
//     console.log("Connected to MySQL database");
//   }
// });

// connection.query(
//   `
// CREATE TABLE IF NOT EXISTS subscriptions (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   user_id INT,
//   subscription_data JSON
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8`
// );

async function crawlingserver() {
  const maxResults = 15;

  try {
    for (let currentPage = 1; results.length < maxResults; currentPage++) {
      const url = `https://www.snu.ac.kr/snunow/notice/genernal?page=${currentPage}`;
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);
      const elements = $("table tbody tr");

      let currentResults = previousResults.slice();
      let newTitles = [];

      if (elements.length === 0) {
        break;
      }

      elements.each((index, element) => {
        if (results.length < maxResults) {
          const elementData = {
            title: cleanText(
              $(element).find("td.col-title a span span").text()
            ),
            link: `https://www.snu.ac.kr${$(element)
              .find("td.col-title a")
              .attr("href")}`,
            date: cleanText($(element).find("td.col-date").text()),
          };
          results.push(elementData);
          // 새로운 글의 제목을 currentTitles 배열에 추가합니다.
          if (!currentResults.includes(elementData.title)) {
            currentResults.push(elementData.title);
          }
        }
      });
      // 새로운 글의 제목을 이전 제목과 비교하여 새 글만 추출합니다.
      newTitles = currentResults.filter(
        (title) => !previousResults.includes(title)
      );
      // 현재 제목을 이전 제목으로 업데이트합니다.
      previousResults = currentResults;
      newPush.push(...newTitles);
    }
    console.log("새 공지사항:", newPush);

    PushNotifications(newPush);

    app.get("/data", (req, res) => {
      res.json(results);
    });
  } catch (error) {
    console.error(error);
  }
}

app.listen(port, () => {
  console.log(`웹 서버가 ${port} 에서 실행 중입니다.`);
  crawlingserver();
});

function cleanText(text) {
  return text.replace(/\n/g, "").replace(/\s+/g, " ").trim();
}

cron.schedule("*/1 * * * *", () => {
  crawlingserver();
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
  "https://github.com/cron4321/App",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

app.get("/vapidPublicKey", function (req, res) {
  res.send(process.env.VAPID_PUBLIC_KEY);
});

app.post("/register", function (req, res) {
  const subscription = req.body.subscription;
  const subscriptionString = JSON.stringify(subscription);
  
  // connection.query(
  //   "INSERT INTO subscriptions (user_id, subscription_data) VALUES (?, ?) ON DUPLICATE KEY UPDATE subscription_data = VALUES(subscription_data)",
  //   [userId, subscriptionString]
  // );
  subscriptions.push(subscription);
  res.status(201);
});

function PushNotifications() {
  const payload = JSON.stringify({
    title: "새 공지사항이 있습니다!",
    body: newPush,
  });
  subscriptions.forEach((subscription) => {
    console.log(subscription);
    webpush
      .sendNotification(subscription, payload)
      .then(() => {
        console.log("푸시알림 전송 성공");
      })
      .catch((error) => {
        console.error("푸시알림 전송 실패:", error);
      });
  });
}