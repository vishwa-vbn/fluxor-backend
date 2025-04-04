const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config();

// Define allowed origins
const allowedOrigins = [
  "http://localhost:5173", // Development
  "https://your-frontend-domain.vercel.app" // Replace with your actual frontend Vercel domain
];

// 🔹 Enable CORS with dynamic origin checking
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Check if the origin is in our allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// 🔹 Handle preflight requests manually (optional, but ensures Vercel compatibility)
app.options("*", cors()); // Enable preflight for all routes

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
