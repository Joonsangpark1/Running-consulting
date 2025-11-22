// server.js
const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const app = express();

const PORT = process.env.PORT || 3000; // Render 호환

/* ------------------------------------------------
   DB SETUP
------------------------------------------------ */
const db = new sqlite3.Database("./db.sqlite");

// 설문조사 테이블 (index.html 서베이)
db.run(`
  CREATE TABLE IF NOT EXISTS surveys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    situation TEXT,
    current_time TEXT,
    current_training TEXT,
    premium_extra TEXT,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 프리미엄 유저 테이블
db.run(`
  CREATE TABLE IF NOT EXISTS premium_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nickname TEXT,
    email TEXT,
    phone TEXT,
    age TEXT,
    gender TEXT,
    goal TEXT,
    motivation TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

/* ------------------------------------------------
   MIDDLEWARE
------------------------------------------------ */
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* ------------------------------------------------
   설문 저장 API
------------------------------------------------ */
app.post("/api/survey", (req, res) => {
  const {
    situation,
    current_time,
    current_training,
    premium_extra,
    email
  } = req.body;

  if (!email || !situation || !current_time) {
    return res.status(400).json({ message: "필수 항목 누락" });
  }

  const stmt = db.prepare(`
    INSERT INTO surveys
    (situation, current_time, current_training, premium_extra, email)
    VALUES (?, ?, ?, ?, ?)
  `);

  stmt.run(
    situation,
    current_time,
    current_training,
    premium_extra,
    email,
    function (err) {
      if (err) return res.status(500).json({ message: "DB 저장 오류" });
      res.json({ message: "설문 저장 완료", id: this.lastID });
    }
  );
});

/* ------------------------------------------------
   설문 조회 API (관리자용)
------------------------------------------------ */
app.get("/api/survey", (req, res) => {
  db.all(`SELECT * FROM surveys ORDER BY created_at DESC`, (err, rows) => {
    if (err) return res.status(500).json({ message: "DB 조회 오류" });
    res.json(rows);
  });
});

/* ------------------------------------------------
   프리미엄 등록 API (이메일 발송 제거 버전)
------------------------------------------------ */
app.post("/api/premium", (req, res) => {
  const {
    nickname,
    email,
    phone,
    age,
    gender,
    goal,
    motivation
  } = req.body;

  if (!nickname || !email || !age || !gender || !goal) {
    return res.status(400).json({ message: "필수 항목 누락" });
  }

  const stmt = db.prepare(`
    INSERT INTO premium_users
      (nickname, email, phone, age, gender, goal, motivation)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    nickname,
    email,
    phone,
    age,
    gender,
    goal,
    motivation,
    function (err) {
      if (err) return res.status(500).json({ message: "DB 저장 오류" });

      res.json({
        message: "프리미엄 등록 성공",
        id: this.lastID
      });
    }
  );
});

/* ------------------------------------------------
   프리미엄 유저 조회 API
------------------------------------------------ */
app.get("/api/premium", (req, res) => {
  db.all(`SELECT * FROM premium_users ORDER BY created_at DESC`, (err, rows) => {
    if (err) return res.status(500).json({ message: "DB 조회 오류" });
    res.json(rows);
  });
});

/* ------------------------------------------------
   서버 시작
------------------------------------------------ */
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
