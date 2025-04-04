const express = require("express");
const cors = require("cors"); // Import CORS
const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config();

// 🛠 Enable CORS for frontend requests
app.use(cors({
  origin: "*", // Allows requests from any origin
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));


// Middleware to parse JSON bodies
app.use(express.json());

// Mount routes
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/posts", require("./routes/post.routes"));
app.use("/api/categories", require("./routes/category.routes"));
app.use("/api/post-categories", require("./routes/postCategories.routes"));
app.use("/api/tags", require("./routes/tags.routes"));
app.use("/api/post-tags", require('./routes/postTags.routes'));
app.use("/api/comments", require("./routes/comments.routes"));
app.use("/api/ad-units", require("./routes/adUnits.routes"));
app.use("/api/settings", require("./routes/settings.routes"));

// Simple health-check endpoint
app.get("/", (req, res) => {
  res.send("Backend API is running!");
});

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
