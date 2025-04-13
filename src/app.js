// // index.js
// const express = require("express");
// const app = express();
// const port = process.env.PORT || 3000;
// require("dotenv").config();

// // Middleware to parse JSON bodies
// app.use(express.json());

// // Mount routes
// app.use("/api/users", require("./routes/user.routes"));
// app.use("/api/posts", require("./routes/post.routes"));
// app.use("/api/categories", require("./routes/category.routes"));
// app.use("/api/post-categories",require("./routes/postCategories.routes"));
// app.use("/api/tags",require("./routes/tags.routes"));
// app.use("/api/post-tags",require('./routes/postTags.routes'))
// app.use("/api/comments", require("./routes/comments.routes"));
// app.use("/api/ad-units", require("./routes/adUnits.routes"));
// app.use("/api/settings", require("./routes/settings.routes"));



// // Add similar lines for posts, categories, tags, comments, ad_units, settings

// // Simple health-check endpoint
// app.get("/", (req, res) => {
//   res.send("Backend API is running!");
// });

// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });





// // index.js
// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const { listenClient } = require("./config/db"); // Assumes db.js exports listenClient
// require("dotenv").config();

// const app = express();
// const server = http.createServer(app); // Create HTTP server for Socket.IO
// const port = process.env.PORT || 3000;

// // Initialize Socket.IO
// const io = new Server(server, {
//   cors: {
//     origin: "*", // Adjust to your frontend URL (e.g., http://localhost:3001 or https://yourblog.com)
//     methods: ["GET", "POST","PUT","UPDATE","DELETE","OPTIONS"],
//   },
// });

// // Middleware to parse JSON bodies
// app.use(express.json());

// // Mount routes (unchanged)
// app.use("/api/users", require("./routes/user.routes"));
// app.use("/api/posts", require("./routes/post.routes"));
// app.use("/api/categories", require("./routes/category.routes"));
// app.use("/api/post-categories", require("./routes/postCategories.routes"));
// app.use("/api/tags", require("./routes/tags.routes"));
// app.use("/api/post-tags", require("./routes/postTags.routes"));
// app.use("/api/comments", require("./routes/comments.routes"));
// app.use("/api/ad-units", require("./routes/adUnits.routes"));
// app.use("/api/settings", require("./routes/settings.routes"));

// // Handle PostgreSQL notifications for tags
// listenClient.on("notification", (msg) => {
//   if (msg.channel === "tag_changes") {
//     const payload = JSON.parse(msg.payload);
//     io.emit("tag_change", payload); // Broadcast to all connected clients
//   }
// });

// // Simple health-check endpoint
// app.get("/", (req, res) => {
//   res.send("Backend API is running!");
// });

// // Start server
// server.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });


// // backend/index.js
// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");
// const { listenClient } = require("./config/db");
// require("dotenv").config();

// const app = express();
// const server = http.createServer(app);
// const port = process.env.PORT || 3000;

// // CORS middleware for REST API
// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173", // Vite frontend
//       "https://yourblog.com", // Add your production domain
//       "https://admin.free-subdomain.com", // Add admin domain if needed
//     ],
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// // Middleware to parse JSON bodies
// app.use(express.json());

// // Initialize Socket.IO with /blog namespace
// const io = new Server(server, {
//   cors: {
//     origin: [
//       "http://localhost:5173",
//       "https://yourblog.com",
//       "https://admin.free-subdomain.com",
//     ],
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//   },
// });

// const blogNamespace = io.of("/blog");

// // Optional: Token verification for Socket.IO
// blogNamespace.use((socket, next) => {
//   const token = socket.handshake.auth.token;
//   if (token) return next(); // Add JWT verification if needed
//   next(new Error("Authentication required"));
// });

// // Handle PostgreSQL notifications for tags
// listenClient.on("notification", (msg) => {
//   if (msg.channel === "tag_changes") {
//     const payload = JSON.parse(msg.payload);
//     blogNamespace.emit("tag_change", payload); // Emit to /blog namespace
//   }
// });

// // Mount routes
// app.use("/api/users", require("./routes/user.routes"));
// app.use("/api/posts", require("./routes/post.routes"));
// app.use("/api/categories", require("./routes/category.routes"));
// app.use("/api/post-categories", require("./routes/postCategories.routes"));
// app.use("/api/tags", require("./routes/tags.routes"));
// app.use("/api/post-tags", require("./routes/postTags.routes"));
// app.use("/api/comments", require("./routes/comments.routes"));
// app.use("/api/ad-units", require("./routes/adUnits.routes"));
// app.use("/api/settings", require("./routes/settings.routes"));

// // Health-check endpoint
// app.get("/", (req, res) => {
//   res.send("Backend API is running!");
// });

// // Start server
// server.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });


// backend/index.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { listenClient } = require("./config/db");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

// CORS middleware for REST API
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://yourblog.com",
      "https://admin.free-subdomain.com",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize Socket.IO with /blog namespace
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://yourblog.com",
      "https://admin.free-subdomain.com",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  },
});

const blogNamespace = io.of("/blog");

// Optional: Token verification for Socket.IO
blogNamespace.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) return next();
  next(new Error("Authentication required"));
});

// Handle PostgreSQL notifications
listenClient.on("notification", (msg) => {
  if (msg.channel === "tag_changes") {
    const payload = JSON.parse(msg.payload);
    blogNamespace.emit("tag_change", payload);
  }
  if (msg.channel === "user_changes") {
    console.log("changes in users ")
    const payload = JSON.parse(msg.payload);
    blogNamespace.emit("user_change", payload);
  }

  if (msg.channel === "post_changes") {
    const payload = JSON.parse(msg.payload);
    blogNamespace.emit("post_change", payload);
  }

  if (msg.channel === "post_category_changes") {
    const payload = JSON.parse(msg.payload);
    blogNamespace.emit("post_category_change", payload);
  }
  if (msg.channel === "post_tag_changes") {
    const payload = JSON.parse(msg.payload);
    blogNamespace.emit("post_tag_change", payload);
  }
});

// Mount routes
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/posts", require("./routes/post.routes"));
app.use("/api/categories", require("./routes/category.routes"));
app.use("/api/post-categories", require("./routes/postCategories.routes"));
app.use("/api/tags", require("./routes/tags.routes"));
app.use("/api/post-tags", require("./routes/postTags.routes"));
app.use("/api/comments", require("./routes/comments.routes"));
app.use("/api/ad-units", require("./routes/adUnits.routes"));
app.use("/api/settings", require("./routes/settings.routes"));

// Health-check endpoint
app.get("/", (req, res) => {
  res.send("Backend API is running!");
});

// Start server
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});







// {
//   "version": 2,
//   "builds": [
//     {
//       "src": "src/app.js",
//       "use": "@vercel/node"
//     }
//   ],
//   "routes": [
//     {
//       "src": "/(.*)",
//       "dest": "/src/app.js",
//       "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//       "headers": {
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
//         "Access-Control-Allow-Credentials": "true",
//         "Access-Control-Allow-Headers": "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version"
//       }
//     }
//   ],
//   "env": {
//     "NODE_ENV": "production"
//   },

// } 
