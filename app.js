const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config();

// 🔹 Dynamic CORS setup to handle different origins
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // Handle preflight request
  }

  next();
});

// 🛠 Enable CORS globally with dynamic origin handling
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Allow non-browser clients (e.g., Postman)
    callback(null, true); // Allow all origins dynamically
  },
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  credentials: true // Allow cookies and authorization headers
}));

// 🔹 Middleware to parse JSON bodies
app.use(express.json());

// 🔹 Mount routes
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/posts", require("./routes/post.routes"));
app.use("/api/categories", require("./routes/category.routes"));
app.use("/api/post-categories", require("./routes/postCategories.routes"));
app.use("/api/tags", require("./routes/tags.routes"));
app.use("/api/post-tags", require("./routes/postTags.routes"));
app.use("/api/comments", require("./routes/comments.routes"));
app.use("/api/ad-units", require("./routes/adUnits.routes"));
app.use("/api/settings", require("./routes/settings.routes"));

// 🔹 Simple health-check endpoint
app.get("/", (req, res) => {
  res.send("Backend API is running!");
});

// 🔹 Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
