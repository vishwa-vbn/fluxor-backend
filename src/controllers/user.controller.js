const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

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
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Configure nodemailer (Replace with your SMTP provider)
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "vnaik@smartsight.in",
    pass: "$$!vnaik@1033",
  },
});

const forgotPasswordHandler = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.getUserByEmail(email);

    if (!user) return res.status(404).json({ error: "User not found" });

    const resetToken = await userModel.generateResetToken(user.id);
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Send email with reset link
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link is valid for 15 minutes.</p>`,
    });

    res.json({ message: "Password reset link sent to your email." });
  } catch (err) {
    console.error("Error in forgot password:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const resetPasswordHandler = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded)
      return res.status(400).json({ error: "Invalid or expired token" });

    // Update password
    const updatedUser = await userModel.updatePassword(
      decoded.userId,
      newPassword
    );
    res.json({ message: "Password successfully updated" });
  } catch (err) {
    console.error("Error in reset password:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  createUserHandler,
  createAdminHandler,
  getUserByIdHandler,
  loginUserHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
};
