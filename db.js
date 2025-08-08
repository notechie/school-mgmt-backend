// db.js
import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

// Create connection
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

// Connect and setup table
db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
  console.log("✅ Connected to Railway MySQL");

  // Create table if not exists
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
});

export default db;
