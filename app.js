const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config();

// Define allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://fluxor-frontend.vercel.app",
];

// 🔹 CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Origin"],
  credentials: true,
  optionsSuccessStatus: 204,
};

// Apply CORS middleware (MUST be first)
app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options("*", cors(corsOptions));


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

// 🔹 Start the server (for local dev, optional for Vercel)
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app; // Export for Vercel
