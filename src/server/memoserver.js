const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const port = 5000;

app.use(cors());

app.use(express.json());

const connection = mysql.createConnection({
  host: '52.78.105.126',
  user: '2team',
  password: '1234',
  database: 'projectdb',
  port: 31212,
});

connection.connect((err) => {
  if (err) {
    console.error("MySQL 연결 실패:", err);
  } else {
    console.log("MySQL에 연결되었습니다.");

    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS memos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT
      )
    `;

    connection.query(createTableSQL, (createErr, createResult) => {
      if (createErr) {
        console.error("메모 테이블 생성 오류:", createErr);
      } else {
        console.log("메모 테이블이 생성되었습니다.");
      }
    });
  }
});

app.get("/api/memos", (req, res) => {
  const sql = "SELECT * FROM memos";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("메모 데이터 가져오기 오류:", err);
      res.status(500).json({ error: "데이터 가져오기 오류" });
    } else {
      res.json(results);
    }
  });
});

app.post("/api/memos", (req, res) => {
    const { title, content } = req.body;
    const sql = "INSERT INTO memos (title, content) VALUES (?, ?)";
    connection.query(sql, [title, content], (err, result) => {
      if (err) {
        console.error("메모 데이터 추가 오류:", err);
        res.status(500).json({ error: "데이터 추가 오류" });
      } else {
        console.log("메모가 추가되었습니다.");
        res.json({ message: "메모가 추가되었습니다.", insertId: result.insertId });
      }
    });
  });

app.put("/api/memos/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "올바르지 않은 ID" });
    }
  
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "제목과 내용은 필수입니다." });
    }
  
    const sql = "UPDATE memos SET title = ?, content = ? WHERE id = ?";
    connection.query(sql, [title, content, id], (err, result) => {
      if (err) {
        console.error("메모 데이터 수정 오류:", err);
        res.status(500).json({ error: "데이터 수정 오류" });
      } else {
        console.log("메모가 수정되었습니다.");
        res.json({ message: "메모가 수정되었습니다." });
      }
    });
});

app.delete("/api/memos/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: "올바르지 않은 ID" });
  }

  const sql = "DELETE FROM memos WHERE id = ?";
  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.error("메모 데이터 삭제 오류:", err);
      res.status(500).json({ error: "데이터 삭제 오류" });
    } else {
      console.log("메모가 삭제되었습니다.");
      res.json({ message: "메모가 삭제되었습니다." });
    }
  });
});

app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
