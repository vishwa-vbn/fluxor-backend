const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// CORS Configuration
const corsOptions = {
  origin: "*", // Allow all origins, or replace with specific domains
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions)); // Apply CORS middleware
app.options("*", cors(corsOptions)); // Handle preflight requests

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Export the app for Vercel deployment
module.exports = app;
