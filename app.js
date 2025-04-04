const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Define allowed origins – make sure these exactly match your client origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://fluxor-frontend.vercel.app",
];

// CORS options configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Apply CORS middleware first so that every route gets these headers
app.use(cors(corsOptions));

// Make sure preflight requests (OPTIONS) are handled for all routes
app.options("*", cors(corsOptions));

// Parse incoming JSON requests
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
