import express from "express";
import dotenv from "dotenv";
import db from "./db.js";

dotenv.config();

const app = express();
app.use(express.json());

// ✅ Create Schools Table if not exists (on server start)
const createTableSQL = `
  CREATE TABLE IF NOT EXISTS schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL
  )
`;
db.query(createTableSQL, (err) => {
  if (err) {
    console.error("❌ Table creation failed:", err.message);
  } else {
    console.log("✅ 'schools' table is ready");
  }
});

// ✅ POST API - Add a new school
app.post("/schools", (req, res) => {
  const { name, address, latitude, longitude } = req.body;
  console.log("📦 Incoming body:", req.body);

  if (!name || !address || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, address, latitude, longitude], (err, result) => {
    if (err) {
      console.error("❌ Insert failed:", err.message);
      return res.status(500).json({ error: "Database insert failed" });
    }
    res.status(201).json({
      message: "School added successfully",
      id: result.insertId
    });
  });
});

// ✅ GET API - Fetch all schools
app.get("/schools", (req, res) => {
  db.query("SELECT * FROM schools", (err, rows) => {
    if (err) {
      console.error("❌ Fetch failed:", err.message);
      return res.status(500).json({ error: "Database fetch failed" });
    }
    res.json(rows);
  });
});

// ✅ Default route
app.get("/", (req, res) => {
  res.send("School Management API is running 🚀");
});

// ✅ Start Server (for local + Railway)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


