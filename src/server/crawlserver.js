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
const data = require("./UniList.json");
const Host = data.Uni1.Host;

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

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

app.listen(port, () => {
  console.log(`웹 서버가 http://15.164.241.36:${port} 에서 실행 중입니다.`);
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
