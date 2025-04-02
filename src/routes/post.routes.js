const express = require("express");
const {
  createPostHandler,
  getPostByIdHandler,
  getPostBySlugHandler,
  getAllPostsHandler,
  updatePostHandler,
  deletePostHandler,
} = require("../controllers/post.controller");

const { isAuthenticated, isAdmin } = require("../middleware/auth");


console.log("is auth",isAuthenticated)
const router = express.Router();

// Public routes (No authentication required)
router.get("/:id", getPostByIdHandler); // Fetch post by ID
router.get("/slug/:slug", getPostBySlugHandler); // Fetch post by slug

// Protected routes (Require authentication)
router.post("/", isAuthenticated, isAdmin, createPostHandler); // Create a new post (Admin only)
router.put("/:id", isAuthenticated, isAdmin, updatePostHandler); // Update a post (Admin only)
router.delete("/:id", isAuthenticated, isAdmin, deletePostHandler); // Delete a post (Admin only)

module.exports = router;
