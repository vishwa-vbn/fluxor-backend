// const userModel = require("../models/user.model");
// const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");
// const bcrypt = require("bcryptjs");

// const createUserHandler = async (req, res) => {
//   try {
//     const newUser = await userModel.createUser(req.body);
//     res.status(201).json(newUser);
//   } catch (err) {
//     console.error("Error creating user:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// const createAdminHandler = async (req, res) => {
//   try {
//     console.log("Admin registration request received:", req.body);
//     const newAdmin = await userModel.createAdmin(req.body);
//     res.status(201).json(newAdmin);
//   } catch (err) {
//     console.error("Error creating admin:", err);
//     res.status(500).json({ error: err.message || "Internal server error" });
//   }
// };

// const getUserByIdHandler = async (req, res) => {
//   try {
//     const user = await userModel.getUserById(req.params.id);
//     if (!user) return res.status(404).json({ error: "User not found" });
//     res.json(user);
//   } catch (err) {
//     console.error("Error fetching user:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// const loginUserHandler = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await userModel.loginUser({ email, password });

//     if (!user) {
//       return res.status(401).json({ error: "Invalid email or password" });
//     }

//     // 🔑 Fetch permissions using the roleId
//     const permissions = await userModel.getPermissionsByRoleId(user.roleid);

//     const token = jwt.sign(
//       { userId: user.id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "24h" }
//     );

//     res.json({
//       message: "Login successful",
//       token,
//       user,
//       permissions, // 🚀 Send to frontend
//     });
//   } catch (err) {
//     console.error("Error logging in:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// // Configure nodemailer (Replace with your SMTP provider)

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_SERVER,
//   port: process.env.SMTP_PORT,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER, // Your Brevo SMTP login email
//     pass: process.env.EMAIL_PASSWORD, // Your Brevo SMTP password
//   },
// });

// const forgotPasswordHandler = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await userModel.getUserByEmail(email);
//     console.log("User Found:", user);

//     if (!user) return res.status(404).json({ error: "User not found" });

//     const resetToken = await userModel.generateResetToken(user.id);
//     const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

//     // Define email options
//     const emailOptions = {
//       from: process.env.FROM_EMAIL,
//       to: user.email,
//       subject: "🔐 Reset Your Password",
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background: #f9f9f9;">
//           <h2 style="text-align: center; color: #333;">Password Reset Request</h2>
//           <p style="color: #555;">Hello <strong>${user.name}</strong>,</p>
//           <p style="color: #555;">You recently requested to reset your password. Click the button below to proceed:</p>
          
//           <div style="text-align: center; margin: 20px 0;">
//              <a href="${resetLink}" 
//            style="display: flex; align-items: center; justify-content: center; gap: 20px; 
//                   background-color: #007BFF; color: white; padding: 12px 24px; 
//                   text-decoration: none; border-radius: 5px; font-size: 16px; width: fit-content; margin: auto;">
//           🔒 <span>Reset Password</span>
//         </a>
//           </div>
    
//           <p style="color: #777; font-size: 14px;">
//             If you didn’t request this, please ignore this email. This link will expire in <strong>15 minutes</strong>.
//           </p>
          
//           <hr style="border: none; border-top: 1px solid #ddd;">
          
//           <p style="color: #999; font-size: 12px; text-align: center;">
//             If you need help, contact our support team.
//           </p>
//         </div>
//       `,
//     };

//     console.log("Sending Email with Options:", emailOptions);

//     // Send email
//     let info = await transporter.sendMail(emailOptions);

//     console.log("Email Sent Response:", info);

//     res.json({ message: "Password reset link sent to your email." });
//   } catch (err) {
//     console.error("Error in forgot password:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// const resetPasswordHandler = async (req, res) => {
//   try {
//     // Extract token from query parameters
//     const { token } = req.query;
//     const { newPassword } = req.body;

//     if (!token) {
//       return res.status(400).json({ error: "Token is missing" });
//     }
//     if (!newPassword) {
//       return res.status(400).json({ error: "New password is required" });
//     }

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (!decoded) {
//       return res.status(400).json({ error: "Invalid or expired token" });
//     }

//     // Hash new password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     // Update password in database
//     await userModel.updatePassword(decoded.userId, hashedPassword);

//     res.json({ message: "Password successfully updated" });
//   } catch (err) {
//     console.error("Error in reset password:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// const getAllUsersHandler = async (req, res) => {
//   try {
//     // Verify the user is an admin
//     const token = req.headers.authorization?.split(" ")[1]; // Expecting "Bearer <token>"
//     if (!token) {
//       return res.status(401).json({ error: "No token provided" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (decoded.role !== "admin") {
//       return res.status(403).json({ error: "Access denied. Admins only." });
//     }

//     // Fetch all users
//     const users = await userModel.getAllUsers();
//     res.json(users);
//   } catch (err) {
//     console.error("Error fetching all users:", err);
//     if (err.name === "JsonWebTokenError") {
//       return res.status(401).json({ error: "Invalid token" });
//     }
//     res.status(500).json({ error: "Internal server error" });
//   }
// };



// const updateUserHandler = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedUser = await userModel.updateUser(id, req.body);
//     res.json(updatedUser);
//   } catch (err) {
//     console.error("Error updating user:", err);
//     if (err.message === "User not found") {
//       return res.status(404).json({ error: "User not found" });
//     }
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// // Delete a single user
// const deleteUserHandler = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedUser = await userModel.deleteUser(id);
//     res.json({ message: "User deleted successfully", user: deletedUser });
//   } catch (err) {
//     console.error("Error deleting user:", err);
//     if (err.message === "User not found") {
//       return res.status(404).json({ error: "User not found" });
//     }
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// // Bulk delete users
// const bulkDeleteUsersHandler = async (req, res) => {
//   try {
//     const { userIds } = req.body; // Expecting an array of user IDs
//     if (!Array.isArray(userIds) || userIds.length === 0) {
//       return res.status(400).json({ error: "Invalid or empty user IDs array" });
//     }

//     const deletedUsers = await userModel.bulkDeleteUsers(userIds);
//     res.json({ 
//       message: `Successfully deleted ${deletedUsers.length} users`, 
//       deletedUsers 
//     });
//   } catch (err) {
//     console.error("Error bulk deleting users:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };


// const getUserWithPermissionsHandler = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Verify the user is authenticated and authorized (admin or self)
//     const token = req.headers.authorization?.split(" ")[1]; // Expecting "Bearer <token>"
//     if (!token) {
//       return res.status(401).json({ error: "No token provided" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (decoded.role !== "admin" && decoded.userId !== parseInt(id)) {
//       return res.status(403).json({ error: "Access denied. Admins or self only." });
//     }

//     // Fetch user with permissions
//     const { user, permissions } = await userModel.getUserWithPermissionsById(parseInt(id));
    
//     // Format response to match Redux state structure
//     res.json({
//       message: "User data retrieved successfully",
//       user,
//       permissions,
//     });
//   } catch (err) {
//     console.error("Error fetching user with permissions:", err);
//     if (err.message === "User not found") {
//       return res.status(404).json({ error: "User not found" });
//     }
//     if (err.name === "JsonWebTokenError") {
//       return res.status(401).json({ error: "Invalid token" });
//     }
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// module.exports = {
//   createUserHandler,
//   createAdminHandler,
//   getUserByIdHandler,
//   loginUserHandler,
//   forgotPasswordHandler,
//   getAllUsersHandler,
//   resetPasswordHandler,
//   updateUserHandler,        // New
//   deleteUserHandler,        // New
//   bulkDeleteUsersHandler,
//   getUserWithPermissionsHandler,
// };


const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const ImageKit = require("imagekit");
const multer = require("multer");

// Validate ImageKit configuration
const imageKitConfig = {
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
};

if (!imageKitConfig.publicKey || !imageKitConfig.privateKey || !imageKitConfig.urlEndpoint) {
  console.error("ImageKit configuration is incomplete. Please check environment variables.");
}

// Initialize ImageKit
const imageKit = new ImageKit(imageKitConfig);

// Configure Multer for file handling
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    console.log("Multer processing file:", file ? file.originalname : "No file provided");
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!file) {
      return cb(null, false); // Skip if no file, allow processing to continue
    }
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG and PNG are allowed."));
    }
  },
}).single("avatar");

const createUserHandler = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.error("Multer error:", err.message);
        return res.status(400).json({ error: err.message });
      }

      console.log("createUserHandler - req.file:", req.file ? req.file.originalname : "No file uploaded");

      let userData = { ...req.body, avatar_url: null, avatar_file_id: null };

      // Handle avatar upload
      if (req.file) {
        try {
          console.log("Uploading to ImageKit:", req.file.originalname);
          const uploadResponse = await imageKit.upload({
            file: req.file.buffer,
            fileName: `user_${Date.now()}_${req.file.originalname}`,
            folder: "/user_avatars",
            tags: ["user", "avatar"],
          });

          console.log("ImageKit upload response:", {
            url: uploadResponse.url,
            fileId: uploadResponse.fileId,
          });

          userData.avatar = uploadResponse.url;
          userData.file_id = uploadResponse.fileId;
        } catch (imageKitError) {
          console.error("ImageKit upload failed:", imageKitError.message);
          // Proceed with user creation but include error in response
          userData.avatar_upload_error = `Failed to upload avatar: ${imageKitError.message}`;
        }
      }

      console.log("Creating user with data:", userData);
      const newUser = await userModel.createUser(userData);
      res.status(201).json(newUser);
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createAdminHandler = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.error("Multer error in createAdminHandler:", err.message);
        return res.status(400).json({ error: err.message });
      }

      console.log("createAdminHandler - req.file:", req.file ? req.file.originalname : "No file uploaded");

      let adminData = { ...req.body, avatar_url: null, avatar_file_id: null };

      // Handle avatar upload
      if (req.file) {
        try {
          console.log("Uploading to ImageKit:", req.file.originalname);
          const uploadResponse = await imageKit.upload({
            file: req.file.buffer,
            fileName: `admin_${Date.now()}_${req.file.originalname}`,
            folder: "/user_avatars",
            tags: ["admin", "avatar"],
          });

          console.log("ImageKit upload response:", {
            url: uploadResponse.url,
            fileId: uploadResponse.fileId,
          });

          adminData.avatar = uploadResponse.url;
          adminData.file_id = uploadResponse.fileId;
        } catch (imageKitError) {
          console.error("ImageKit upload failed:", imageKitError.message);
          // Proceed with admin creation but include error in response
          adminData.avatar_upload_error = `Failed to upload avatar: ${imageKitError.message}`;
        }
      }

      console.log("Admin registration request received:", adminData);
      const newAdmin = await userModel.createAdmin(adminData);
      res.status(201).json(newAdmin);
    });
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
      { expiresIn: "24h" }
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

const getAllUsersHandler = async (req, res) => {
  try {
    // Verify the user is an admin
    const token = req.headers.authorization?.split(" ")[1]; // Expecting "Bearer <token>"
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    // Fetch all users
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error("Error fetching all users:", err);
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateUserHandler = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      const { id } = req.params;
      let userData = { ...req.body, avatar_url: null, avatar_file_id: null };

      // Fetch existing user to get current avatar details
      const existingUser = await userModel.getUserById(id);
      if (!existingUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Delete existing avatar from ImageKit if it exists
      if (existingUser.avatar_file_id) {
        try {
          await imageKit.deleteFile(existingUser.avatar_file_id);
          console.log(`Deleted ImageKit file: ${existingUser.avatar_file_id} for user ${id}`);
        } catch (imageKitError) {
          console.error(`Failed to delete ImageKit file for user ${id}:`, imageKitError.message);
        }
      }

      // Handle new avatar upload
      if (req.file) {
        const uploadResponse = await imageKit.upload({
          file: req.file.buffer,
          fileName: `user_${Date.now()}_${req.file.originalname}`,
          folder: "/user_avatars",
          tags: ["user", "avatar"],
        });

        userData.avatar = uploadResponse.url;
        userData.file_id = uploadResponse.fileId;
      }

      const updatedUser = await userModel.updateUser(id, userData);
      res.json(updatedUser);
    });
  } catch (err) {
    console.error("Error updating user:", err);
    if (err.message === "User not found") {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a single user
const deleteUserHandler = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch user to get avatar details
    const user = await userModel.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete avatar from ImageKit if it exists
    if (user.file_id) {
      try {
        await imageKit.deleteFile(user.file_id);
        console.log(`Deleted ImageKit file: ${user.file_id} for user ${id}`);
      } catch (imageKitError) {
        console.error(`Failed to delete ImageKit file for user ${id}:`, imageKitError.message);
      }
    }

    const deletedUser = await userModel.deleteUser(id);
    res.json({ message: "User deleted successfully", user: deletedUser });
  } catch (err) {
    console.error("Error deleting user:", err);
    if (err.message === "User not found") {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

// Bulk delete users
const bulkDeleteUsersHandler = async (req, res) => {
  try {
    const { userIds } = req.body; // Expecting an array of user IDs
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: "Invalid or empty user IDs array" });
    }

    // Fetch users to get avatar details
    const users = await userModel.getUsersByIds(userIds);
    for (const user of users) {
      if (user.file_id) {
        try {
          await imageKit.deleteFile(user.file_id);
          console.log(`Deleted ImageKit file: ${user.file_id} for user ${user.id}`);
        } catch (imageKitError) {
          console.error(`Failed to delete ImageKit file for user ${user.id}:`, imageKitError.message);
        }
      }
    }

    const deletedUsers = await userModel.bulkDeleteUsers(userIds);
    res.json({ 
      message: `Successfully deleted ${deletedUsers.length} users`, 
      deletedUsers 
    });
  } catch (err) {
    console.error("Error bulk deleting users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserWithPermissionsHandler = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify the user is authenticated and authorized (admin or self)
    const token = req.headers.authorization?.split(" ")[1]; // Expecting "Bearer <token>"
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin" && decoded.userId !== parseInt(id)) {
      return res.status(403).json({ error: "Access denied. Admins or self only." });
    }

    // Fetch user with permissions
    const { user, permissions } = await userModel.getUserWithPermissionsById(parseInt(id));
    
    // Format response to match Redux state structure
    res.json({
      message: "User data retrieved successfully",
      user,
      permissions,
    });
  } catch (err) {
    console.error("Error fetching user with permissions:", err);
    if (err.message === "User not found") {
      return res.status(404).json({ error: "User not found" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createUserHandler,
  createAdminHandler,
  getUserByIdHandler,
  loginUserHandler,
  forgotPasswordHandler,
  getAllUsersHandler,
  resetPasswordHandler,
  updateUserHandler,
  deleteUserHandler,
  bulkDeleteUsersHandler,
  getUserWithPermissionsHandler,
};