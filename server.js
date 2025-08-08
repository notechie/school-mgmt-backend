import express from "express";
import dotenv from "dotenv";
import db from "./db.js";

dotenv.config();
const app = express();
app.use(express.json());

// Create table if not exists
db.query(`
  CREATE TABLE IF NOT EXISTS schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL
  )
`);

// ✅ Create a new school
app.post("/schools", (req, res) => {
  const { name, address, latitude, longitude } = req.body;
  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const sql = "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, address, latitude, longitude], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "School added", id: result.insertId });
  });
});

// ✅ Get all schools
app.get("/schools", (req, res) => {
  db.query("SELECT * FROM schools", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ✅ Get school by ID
app.get("/schools/:id", (req, res) => {
  db.query("SELECT * FROM schools WHERE id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "School not found" });
    res.json(results[0]);
  });
});

// ✅ Update school by ID
app.put("/schools/:id", (req, res) => {
  const { name, address, latitude, longitude } = req.body;
  const sql = "UPDATE schools SET name=?, address=?, latitude=?, longitude=? WHERE id=?";
  db.query(sql, [name, address, latitude, longitude, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "School not found" });
    res.json({ message: "School updated" });
  });
});

// ✅ Delete school by ID
app.delete("/schools/:id", (req, res) => {
  db.query("DELETE FROM schools WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "School not found" });
    res.json({ message: "School deleted" });
  });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
});
