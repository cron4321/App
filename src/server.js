const cheerio = require("cheerio");
const axios = require("axios");
const cors = require("cors");
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 4000;

app.use(cors());

async function crawlPages() {
  const baseUrl =
    "https://www.kyonggi.ac.kr/www/selectBbsNttList.do?key=7520&bbsNo=1073";
  const maxResults = 11; // 결과 개수
  const results = [];

  try {
    for (let currentPage = 1; results.length < maxResults; currentPage++) {
      const url = `${baseUrl}&pageUnit=10&searchCnd=all&pageIndex=${currentPage}`;
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
            title: cleanText($(element).find("td.p-subject a").text()),
            link:
              "https://www.kyonggi.ac.kr/www/" +
              $(element).find("td.p-subject a").attr("href"),
            number: cleanText($(element).find("td:nth-child(1) span").text()),
            date: cleanText($(element).find("td:nth-child(7) time").text()),
          };

          results.push(elementData);
        }
      });
    }

    // 결과 데이터 JSON 파일로 저장
    const CrawlingDir = path.join(__dirname, "CrawlingDir");
    if (!fs.existsSync(CrawlingDir)) {
      fs.mkdirSync(CrawlingDir);
    }

    const filePath = path.join(CrawlingDir, "result.json");
    fs.writeFileSync(filePath, JSON.stringify(results, null, 2));

    console.log(results);

    // 데이터를 브라우저에 출력
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

crawlPages();
