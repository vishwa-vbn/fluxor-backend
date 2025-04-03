const categoryModel = require("../models/category.model");
const { successResponse, errorResponse } = require("../utils/response");

// Create a new category
const createCategoryHandler = async (req, res) => {
  try {
    const category = await categoryModel.createCategory(req.body);
    return successResponse(res, 201, "Category created successfully", category);
  } catch (error) {
    return errorResponse(res, error);
  }
};

// Get all categories
const getAllCategoriesHandler = async (req, res) => {
  try {
    const categories = await categoryModel.getAllCategories();
    return successResponse(res, 200, "All categories retrieved successfully", categories);
  } catch (error) {
    return errorResponse(res, error);
  }
};

// Get category by ID
const getCategoryByIdHandler = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const category = await categoryModel.getCategoryById(id);
    if (!category) return errorResponse(res, new Error("Category not found"), 404);
    return successResponse(res, 200, "Category retrieved successfully", category);
  } catch (error) {
    return errorResponse(res, error);
  }
};

// Update a category
const updateCategoryHandler = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updatedCategory = await categoryModel.updateCategory(id, req.body);
    if (!updatedCategory) return errorResponse(res, new Error("Category not found"), 404);
    return successResponse(res, 200, "Category updated successfully", updatedCategory);
  } catch (error) {
    return errorResponse(res, error);
  }
};

// Delete a category
const deleteCategoryHandler = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const deletedCategory = await categoryModel.deleteCategory(id);
    if (!deletedCategory) return errorResponse(res, new Error("Category not found"), 404);
    return successResponse(res, 200, "Category deleted successfully", deletedCategory);
  } catch (error) {
    return errorResponse(res, error);
  }
};

module.exports = {
  createCategoryHandler,
  getAllCategoriesHandler,
  getCategoryByIdHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
};
