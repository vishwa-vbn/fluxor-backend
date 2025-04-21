// // src/config/db.js
// const fs = require("fs");
// const { Client } = require("pg");
// require("dotenv").config();

// const client = new Client({
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   database: process.env.DB_NAME,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// client.connect()
//   .then(() => console.log("✅ Connected to PostgreSQL!"))
//   .catch((err) => console.error("❌ Connection error:", err.stack));

// module.exports = client;
// //new changes

//changes
// src/config/db.js
const { Client } = require("pg");
require("dotenv").config();

// Main client for queries
const queryClient = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Client for listening to notifications
const listenClient = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
});

queryClient.connect()
  .then(() => console.log("✅ Connected to PostgreSQL (Query Client)!"))
  .catch((err) => console.error("❌ Query Client Connection error:", err.stack));

listenClient.connect()
  .then(() => {
    console.log("✅ Connected to PostgreSQL (Listen Client)!");
    listenClient.query("LISTEN tag_changes");
    listenClient.query("LISTEN user_changes"); 
    listenClient.query('LISTEN post_changes');
    listenClient.query('LISTEN post_category_changes');
    listenClient.query('LISTEN post_tag_changes');
    listenClient.query("LISTEN category_changes");
    listenClient.query("LISTEN comment_changes");
    listenClient.query("LISTEN setting_changes");
  })
  .catch((err) => console.error("❌ Listen Client Connection error:", err.stack));

module.exports = { queryClient, listenClient };