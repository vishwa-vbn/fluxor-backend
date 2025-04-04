const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Define allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://fluxor-frontend.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Important for cookies/tokens!
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.sendStatus(204);
});


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
 
// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Export the app for Vercel deployment, if needed
module.exports = app;
