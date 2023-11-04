require("dotenv").config();
const webpush = require("web-push");
const bodyParser = require("body-parser");
const cheerio = require("cheerio");
const axios = require("axios");
const cors = require("cors");
const express = require("express");
const path = require("path");
const cron = require("node-cron");
const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

let previousResults = [];
const subscriptions = [];
const results = [];
let newPush = [];

async function crawlingserver() {
  const maxResults = 15;
  let newPush = [];
  try {
    for (let currentPage = 1; results.length < maxResults; currentPage++) {
      const url = `https://www.snu.ac.kr/snunow/notice/genernal?page=${currentPage}`;
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);
      const elements = $("table tbody tr");
      let currentResults = previousResults.slice();
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
          if (!currentResults.includes(elementData.title)) {
            currentResults.push(elementData.title);
          }
        }
      });
      newTitles = currentResults.filter(
        (title) => !previousResults.includes(title)
      );
      previousResults = currentResults;
      newPush.push(...newTitles);
    }
    console.log("새 공지사항:", newPush);

    if (newPush.length > 0) {
      PushNotifications(newPush);
    } else console.log("새 공지사항이 없습니다.");

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
  subscriptions.push(subscription);
  console.log("사용자 추가됨");
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
