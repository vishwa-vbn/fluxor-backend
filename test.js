const fs = require("fs");
const pg = require("pg");
require("dotenv").config();

// Database connection config
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync("./ca.pem").toString(), // Load Aiven SSL Certificate
  },
};

// Create a PostgreSQL client
const client = new pg.Client(config);

client.connect((err) => {
  if (err) {
    console.error("❌ Database connection error:", err.stack);
    return;
  }
  console.log("✅ Connected to Aiven PostgreSQL");

  // Test Query: Get PostgreSQL Version
  client.query("SELECT VERSION()", [], (err, result) => {
    if (err) {
      console.error("❌ Query execution error:", err.stack);
    } else {
      console.log("📦 PostgreSQL Version:", result.rows[0]);
    }
    client.end();
  });
});
