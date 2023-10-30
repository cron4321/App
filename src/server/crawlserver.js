require("dotenv").config();
const webpush = require("web-push");
const bodyParser = require("body-parser");
const cheerio = require("cheerio");
const axios = require("axios");
const cors = require("cors");
const express = require("express");
const fs = require("fs");
const path = require("path");
const cron = require("node-cron");
const mysql2 = require("mysql2");
const data = require("./UniList.json");
const Host = data.Uni1.Host;

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const connection = mysql2.createConnection({
  host: '52.78.105.126',
  user: '2team',
  password: '1234',
  database: 'projectdb',
  port: 31212,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.message);
  } else {
    console.log("Connected to MySQL database");
  }
});

connection.query(
  `
CREATE TABLE IF NOT EXISTS results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  link VARCHAR(255),
  date VARCHAR(255)
)
`,
  (err, results) => {
    if (err) {
      console.error("Error creating table:", err);
    } else {
      console.log("Table created or already exists");
    }
  }
);

const results = [];
let previousTitles = [];

async function crawlPages() {
  const baseUrl = "https://www.snu.ac.kr/snunow/notice/genernal";
  const maxResults = 15; // 결과 개수

  try {
    for (let currentPage = 1; results.length < maxResults; currentPage++) {
      const url = `${baseUrl}?page=${currentPage}`;
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);

      // 원하는 요소를 선택하고 텍스트를 추출
      const elements = $("table tbody tr");

      if (elements.length === 0) {
        // 페이지에 더 이상 요소가 없는 경우 종료
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
    // 새 푸시 알림 전송
    PushNotifications();

    results.forEach((element) => {
      const { title, link, date } = element;
      const query = `
        INSERT INTO results (title, link, date)
        SELECT ?, ?, ?
        WHERE NOT EXISTS (SELECT link FROM results WHERE link = ?)
      `;
      connection.query(query, [title, link, date, link], (err, results) => {
        if (err) {
          console.error("Error inserting data:", err);
        } else {
          console.log("Data inserted successfully");
        }
      });
    });

    // 데이터 출력
    app.get("/data", (req, res) => {
      res.json(results);
    });
  } catch (error) {
    console.error("크롤링 중 오류 발생:", error);
  }
}

// 웹 서버 시작
app.listen(port, () => {
  console.log(`웹 서버가 http://localhost:${port} 에서 실행 중입니다.`);
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

  // 현재 "title" 데이터를 이전 "title" 데이터로 업데이트
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

//웹 푸시 설정 (VAPID 키 필요)
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
