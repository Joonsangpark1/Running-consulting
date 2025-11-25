// server.js (Supabase + Express)
const express = require("express");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

/* ------------------------------------------------
   Supabase PostgreSQL 연결
------------------------------------------------ */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

/* ------------------------------------------------
   MIDDLEWARE
------------------------------------------------ */
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* ------------------------------------------------
   설문 저장 API
------------------------------------------------ */
app.post("/api/survey", async (req, res) => {
  const {
    situation,
    current_time_value,
    current_training,
    premium_extra,
    email
  } = req.body;

  if (!email || !situation || !current_time_value) {
    return res.status(400).json({ message: "필수 항목 누락" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO surveys
      (situation, current_time_value, current_training, premium_extra, email)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        situation,
        current_time_value,
        current_training,
        premium_extra,
        email
      ]
    );

    res.json({
      message: "설문 저장 완료",
      id: result.rows[0].id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB 저장 오류" });
  }
});

/* ------------------------------------------------
   설문 조회 API
------------------------------------------------ */
app.get("/api/survey", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM surveys ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB 조회 오류" });
  }
});

/* ------------------------------------------------
   프리미엄 등록 API
------------------------------------------------ */
app.post("/api/premium", async (req, res) => {
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

  try {
    const result = await pool.query(
      `INSERT INTO premium_users
      (nickname, email, phone, age, gender, goal, motivation)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        nickname,
        email,
        phone,
        age,
        gender,
        goal,
        motivation
      ]
    );

    res.json({
      message: "프리미엄 등록 성공",
      id: result.rows[0].id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB 저장 오류" });
  }
});

/* ------------------------------------------------
   프리미엄 유저 조회 API
------------------------------------------------ */
app.get("/api/premium", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM premium_users ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB 조회 오류" });
  }
});

/* ------------------------------------------------
   서버 시작
------------------------------------------------ */
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
