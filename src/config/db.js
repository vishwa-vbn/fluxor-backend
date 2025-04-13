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


// // src/config/db.js
// const { Client } = require("pg");
// require("dotenv").config();

// // Main client for queries
// const queryClient = new Client({
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   database: process.env.DB_NAME,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// // Client for listening to notifications
// const listenClient = new Client({
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   database: process.env.DB_NAME,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// queryClient.connect()
//   .then(() => console.log("✅ Connected to PostgreSQL (Query Client)!"))
//   .catch((err) => console.error("❌ Query Client Connection error:", err.stack));

// listenClient.connect()
//   .then(() => {
//     console.log("✅ Connected to PostgreSQL (Listen Client)!");
//     listenClient.query("LISTEN tag_changes");
//     listenClient.query("LISTEN user_changes");
//     listenClient.query("LISTEN post_changes");
//     listenClient.query("LISTEN post_category_changes"); // Add this
//     listenClient.query("LISTEN post_tag_changes");
    
//   })
//   .catch((err) => console.error("❌ Listen Client Connection error:", err.stack));

// module.exports = { queryClient, listenClient };



const { Client } = require('pg');
require('dotenv').config();

// Main client for queries
const queryClient = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false, // Consider true in production with proper certs
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

// Function to connect queryClient with reconnection logic
const connectQueryClient = async () => {
  try {
    await queryClient.connect();
    console.log('✅ Connected to PostgreSQL (Query Client)!');
  } catch (err) {
    console.error('❌ Query Client Connection error:', err.stack);
    setTimeout(connectQueryClient, 5000); // Retry after 5s
  }
};

// Function to connect listenClient with reconnection logic
const connectListenClient = async () => {
  try {
    await listenClient.connect();
    console.log('✅ Connected to PostgreSQL (Listen Client)!');
    await listenClient.query('LISTEN tag_changes');
    await listenClient.query('LISTEN user_changes');
    await listenClient.query('LISTEN post_changes');
    await listenClient.query('LISTEN post_category_changes');
    await listenClient.query('LISTEN post_tag_changes');
  } catch (err) {
    console.error('❌ Listen Client Connection error:', err.stack);
    setTimeout(connectListenClient, 5000); // Retry after 5s
  }
};

// Handle listenClient errors (e.g., disconnects)
listenClient.on('error', (err) => {
  console.error('❌ Listen Client Error:', err.stack);
  listenClient.end().then(() => connectListenClient()); // Reconnect
});

// Connect clients
connectQueryClient();
connectListenClient();

// Cleanup on process exit
process.on('SIGTERM', async () => {
  console.log('🛑 Closing PostgreSQL connections');
  await queryClient.end();
  await listenClient.end();
});

module.exports = { queryClient, listenClient };