const express = require("express");
const {
  createPostHandler,
  getPostByIdHandler,
  getPostBySlugHandler,
  getAllPublishedPostsHandler,
  getAllPostsHandler,
  updatePostHandler,
  deletePostHandler,
} = require("../controllers/post.controller");

const { isAuthenticated, isAdmin } = require("../middleware/auth");

const router = express.Router();

// Public routes (no authentication required)
router.get("/:id", getPostByIdHandler);                // Get post by ID
router.get("/slug/:slug", getPostBySlugHandler);         // Get post by slug
router.get("/status/published", getAllPublishedPostsHandler); // Get all published posts (with pagination)
router.get("/", getAllPostsHandler);                     // Get all posts (all statuses)

// Protected routes (authentication & admin only)
router.post("/", isAuthenticated, isAdmin, createPostHandler); // Create a new post
router.put("/:id", isAuthenticated, isAdmin, updatePostHandler); // Update a post
router.delete("/:id", isAuthenticated, isAdmin, deletePostHandler); // Delete a post

module.exports = router;
