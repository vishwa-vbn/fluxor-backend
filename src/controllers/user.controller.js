const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

const createUserHandler = async (req, res) => {
  try {
    const newUser = await userModel.createUser(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createAdminHandler = async (req, res) => {
  try {
    console.log("Admin registration request received:", req.body);
    const newAdmin = await userModel.createAdmin(req.body);
    res.status(201).json(newAdmin);
  } catch (err) {
    console.error("Error creating admin:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};

const getUserByIdHandler = async (req, res) => {
  try {
    const user = await userModel.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const loginUserHandler = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await userModel.loginUser({ username, email, password });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createUserHandler,
  createAdminHandler,
  getUserByIdHandler,
  loginUserHandler,
};
