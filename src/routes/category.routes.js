const express = require("express");
const {
  createCategoryHandler,
  getAllCategoriesHandler,
  getCategoryByIdHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
} = require("../controllers/category.controller");

const { isAuthenticated, isAdmin } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/", getAllCategoriesHandler); // Get all categories
router.get("/:id", getCategoryByIdHandler); // Get category by ID

// Protected routes (admin only)
router.post("/", isAuthenticated, isAdmin, createCategoryHandler); // Create a new category
router.put("/:id", isAuthenticated, isAdmin, updateCategoryHandler); // Update category
router.delete("/:id", isAuthenticated, isAdmin, deleteCategoryHandler); // Delete category

module.exports = router;
