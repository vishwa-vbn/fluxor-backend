const express = require("express");
const {
  createUserHandler,
  createAdminHandler,
  getUserByIdHandler,
  loginUserHandler,
  resetPasswordHandler,
  forgotPasswordHandler,
  getAllUsersHandler,
  updateUserHandler,        // New
  deleteUserHandler,        // New
  bulkDeleteUsersHandler,
} = require("../controllers/user.controller");

const { isAuthenticated, isAdmin } = require("../middleware/auth");
const router = express.Router();

router.post("/register", createUserHandler);
router.post("/forgot-password", forgotPasswordHandler);
router.post("/reset-password", resetPasswordHandler);

router.post("/register/admin", createAdminHandler);
router.post("/login", loginUserHandler);
router.get("/:id", getUserByIdHandler);
router.get("/",isAuthenticated, isAdmin, getAllUsersHandler);

router.put("/:id", isAuthenticated, isAdmin, updateUserHandler);         // Update user
router.delete("/:id", isAuthenticated, isAdmin, deleteUserHandler);      // Delete single user
router.post("/bulk-delete", isAuthenticated, isAdmin, bulkDeleteUsersHandler);

module.exports = router;
