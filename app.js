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

// Sample login route
app.post("/api/users/login", (req, res) => {
  const { email, password } = req.body;
  // Simple dummy validation – replace with your real authentication logic
  if (!email || !password) {
    return res.status(400).json({
      authPending: false,
      authSuccess: false,
      authError: "Fill all the fields.",
      accessToken: null,
      refreshToken: null,
      loginUser: null,
    });
  }

  // Dummy success response – in a real app you would check credentials and generate tokens
  res.json({
    authPending: false,
    authSuccess: true,
    authError: null,
    accessToken: "dummyAccessToken",
    refreshToken: "dummyRefreshToken",
    loginUser: { email }
  });
});

// Health-check endpoint
app.get("/", (req, res) => {
  res.send("Backend API is running!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Export the app for Vercel deployment, if needed
module.exports = app;
