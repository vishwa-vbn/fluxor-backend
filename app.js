const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config();

// 🔹 Enable CORS
app.use(cors({
  origin: "http://localhost:5173", // Change this to "*" only for development
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// 🔹 Manually handle preflight requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173"); // Change to "*" if needed
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // Preflight request success
  }

  next();
});

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

// 🔹 Health-check endpoint
app.get("/", (req, res) => {
  res.send("Backend API is running!");
});

// 🔹 Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
