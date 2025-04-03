const express = require("express");
const router = express.Router();
const {
  addCategoryToPost,
  removeCategoryFromPost,
  getCategoriesByPost,
  getPostsByCategory,
} = require("../controllers/postCategories.controller");

// Add a category to a post
router.post("/", addCategoryToPost);

// Remove a category from a post
router.delete("/", removeCategoryFromPost);

// Get all categories for a specific post
router.get("/post/:postId", getCategoriesByPost);

// Get all posts under a specific category
router.get("/category/:categoryId", getPostsByCategory);

module.exports = router;
