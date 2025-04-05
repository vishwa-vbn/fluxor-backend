const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

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

// const loginUserHandler = async (req, res) => {
//   try {
//     const { email, password } = req.body; // Remove "username" field for consistency
//     const user = await userModel.loginUser({ email, password });

//     if (!user) {
//       return res.status(401).json({ error: "Invalid email or password" });
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { userId: user.id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.json({ message: "Login successful", token, user });
//   } catch (err) {
//     console.error("Error logging in:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

const loginUserHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.loginUser({ email, password });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 🔑 Fetch permissions using the roleId
    const permissions = await userModel.getPermissionsByRoleId(user.roleid);

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user,
      permissions, // 🚀 Send to frontend
    });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Configure nodemailer (Replace with your SMTP provider)

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, // Your Brevo SMTP login email
    pass: process.env.EMAIL_PASSWORD, // Your Brevo SMTP password
  },
});

const forgotPasswordHandler = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.getUserByEmail(email);
    console.log("User Found:", user);

    if (!user) return res.status(404).json({ error: "User not found" });

    const resetToken = await userModel.generateResetToken(user.id);
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Define email options
    const emailOptions = {
      from: process.env.FROM_EMAIL,
      to: user.email,
      subject: "🔐 Reset Your Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background: #f9f9f9;">
          <h2 style="text-align: center; color: #333;">Password Reset Request</h2>
          <p style="color: #555;">Hello <strong>${user.name}</strong>,</p>
          <p style="color: #555;">You recently requested to reset your password. Click the button below to proceed:</p>
          
          <div style="text-align: center; margin: 20px 0;">
             <a href="${resetLink}" 
           style="display: flex; align-items: center; justify-content: center; gap: 20px; 
                  background-color: #007BFF; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 5px; font-size: 16px; width: fit-content; margin: auto;">
          🔒 <span>Reset Password</span>
        </a>
          </div>
    
          <p style="color: #777; font-size: 14px;">
            If you didn’t request this, please ignore this email. This link will expire in <strong>15 minutes</strong>.
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            If you need help, contact our support team.
          </p>
        </div>
      `,
    };

    console.log("Sending Email with Options:", emailOptions);

    // Send email
    let info = await transporter.sendMail(emailOptions);

    console.log("Email Sent Response:", info);

    res.json({ message: "Password reset link sent to your email." });
  } catch (err) {
    console.error("Error in forgot password:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const resetPasswordHandler = async (req, res) => {
  try {
    // Extract token from query parameters
    const { token } = req.query;
    const { newPassword } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Token is missing" });
    }
    if (!newPassword) {
      return res.status(400).json({ error: "New password is required" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await userModel.updatePassword(decoded.userId, hashedPassword);

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
