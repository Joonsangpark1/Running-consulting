// server.js
const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const nodemailer = require("nodemailer");
const app = express();

const PORT = process.env.PORT || 3000; // Render 호환

/* ------------------------------------------------
   DB SETUP
------------------------------------------------ */
const db = new sqlite3.Database("./db.sqlite");

// 설문조사 테이블
db.run(`
  CREATE TABLE IF NOT EXISTS surveys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    current_time TEXT,
    needed_factor TEXT,
    current_training TEXT,
    price_range TEXT,
    premium_extra TEXT,
    situation TEXT,
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
    height TEXT,
    weight TEXT,
    injury TEXT,
    recent_record TEXT,
    record_3months TEXT,
    weekly_hours TEXT,
    goal TEXT,
    motivation TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);


/* ------------------------------------------------
   MIDDLEWARE
------------------------------------------------ */
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // /public 폴더 static 제공

/* ------------------------------------------------
   설문 저장
------------------------------------------------ */
app.post("/api/survey", (req, res) => {
  const {
    current_time,
    needed_factor,
    current_training,
    price_range,
    premium_extra,
    situation,
    email
  } = req.body;

  if (!email) return res.status(400).json({ message: "이메일은 필수입니다." });

  const stmt = db.prepare(`
    INSERT INTO surveys 
    (current_time, needed_factor, current_training, price_range, premium_extra, situation, email)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    current_time,
    needed_factor,
    current_training,
    price_range,
    premium_extra,
    situation,
    email,
    function (err) {
      if (err) return res.status(500).json({ message: "DB 저장 오류" });

      res.json({ message: "설문 저장 완료", id: this.lastID });
    }
  );
});

// 설문 전체 조회
app.get("/api/survey", (req, res) => {
  db.all(`SELECT * FROM surveys ORDER BY created_at DESC`, (err, rows) => {
    if (err) return res.status(500).json({ message: "DB 조회 오류" });
    res.json(rows);
  });
});


/* ------------------------------------------------
   Nodemailer (환경변수 적용!)
------------------------------------------------ */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,  // Render 환경변수
    pass: process.env.EMAIL_PASS   // Render 환경변수
  }
});


/* ------------------------------------------------
   프리미엄 등록 API
------------------------------------------------ */
app.post("/api/premium", (req, res) => {
  const {
    nickname,
    email,
    phone,
    age,
    gender,
    height,
    weight,
    injury,
    recent_record,
    record_3months,
    weekly_hours,
    goal,
    motivation
  } = req.body;

  if (!nickname || !email || !age || !gender || !height || !weight || !goal) {
    return res.status(400).json({ message: "필수 항목을 입력해주세요." });
  }

  const stmt = db.prepare(`
    INSERT INTO premium_users
      (nickname, email, phone, age, gender, height, weight, injury, recent_record, record_3months, weekly_hours, goal, motivation)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    nickname,
    email,
    phone,
    age,
    gender,
    height,
    weight,
    injury,
    recent_record,
    record_3months,
    weekly_hours,
    goal,
    motivation,
    function (err) {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "DB 저장 오류 발생" });
      }

      /* -----------------------------------------
         이메일 전송
      ------------------------------------------ */
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "프리미엄 러닝 컨설팅 등록 완료",
        html: `
          <h2>프리미엄 등록 완료 🎉</h2>
          <p>${nickname}님, 프리미엄 등록이 성공적으로 완료되었습니다.</p>

          <p><b>📌 입력 요약</b></p>
          <ul>
            <li>나이: ${age}</li>
            <li>성별: ${gender}</li>
            <li>키/몸무게: ${height}cm / ${weight}kg</li>
            <li>목표: ${goal}</li>
            <li>최근 기록: ${recent_record}</li>
            <li>주간 러닝 시간: ${weekly_hours}</li>
          </ul>

          <p>빠르게 분석해 맞춤 플랜을 전달해드리겠습니다!</p>
        `
      };

      transporter.sendMail(mailOptions, (err) => {
        if (err) console.log("📧 메일 전송 실패:", err);
      });

      res.json({ message: "프리미엄 등록 성공", id: this.lastID });
    }
  );
});

// 프리미엄 유저 전체 조회
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
