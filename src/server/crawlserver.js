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

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const results = [];

async function crawlPages() {
  const baseUrl = "https://admission.snu.ac.kr/undergraduate/notice";
  const maxResults = 15; // 결과 개수

  try {
    // 이전에 저장된 데이터 불러오기
    const filePath2 = path.join(__dirname, "CrawlingDir", "result.json");
    if (fs.existsSync(filePath2)) {
      const data = fs.readFileSync(filePath2);
      storedResults = JSON.parse(data);
    }

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
            link: $(element).find("td.col-title a").attr("href"),
            date: cleanText($(element).find("td.col-date").text()),
          };
          // 중복된 항목인지 확인 후 저장
          if (!storedResults.some((item) => item.title === elementData.title)) {
            results.push(elementData);
          }
        }
      });
    }

    // 새 데이터와 이전 데이터를 병합
    const mergedResults = [...storedResults, ...results.slice(0, maxResults)];

    // 결과 데이터 JSON 파일로 저장
    fs.writeFileSync(filePath2, JSON.stringify(mergedResults, null, 2));

    // 결과 데이터 JSON 파일로 저장
    const CrawlingDir = path.join(__dirname, "CrawlingDir");
    if (!fs.existsSync(CrawlingDir)) {
      fs.mkdirSync(CrawlingDir);
    }

    const filePath = path.join(CrawlingDir, "result.json");
    fs.writeFileSync(filePath, JSON.stringify(results, null, 2));

    // 데이터 출력
    app.get("/data", (req, res) => {
      res.json(results);
    });

    // 웹 서버 시작
    app.listen(port, () => {
      console.log(`웹 서버가 http://localhost:${port} 에서 실행 중입니다.`);
    });
  } catch (error) {
    console.error("크롤링 중 오류 발생:", error);
  }
}

function cleanText(text) {
  return text.replace(/\n/g, "").replace(/\s+/g, " ").trim();
}

// 매 30분마다 크롤링 실행
cron.schedule("*/30 * * * *", () => {
  console.log("크롤링을 실행합니다.");
  crawlPages();
});

crawlPages();

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
  "https://github.com/mdn/serviceworker-cookbook/",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY,
);

app.post("/register", (req, res) => {
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

app.post("/register", (req, res) => {
  const subscription = req.body.subscription;
  const payload = results[0].title
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


