const PostCategory = require("../models/postCategories.model");

const addCategoryToPost = async (req, res) => {
  try {
    console.log("Incoming Request Body:", req.body); 
    const { postId, categoryId } = req.body;
    const result = await PostCategory.addCategoryToPost(postId, categoryId);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const removeCategoryFromPost = async (req, res) => {
  try {
    const { postId, categoryId } = req.body;
    const result = await PostCategory.removeCategoryFromPost(postId, categoryId);
    if (!result) return res.status(404).json({ error: "Relation not found" });
    res.json({ message: "Category removed from post", result });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const getCategoriesByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const categories = await PostCategory.getCategoriesByPost(postId);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const getPostsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const posts = await PostCategory.getPostsByCategory(categoryId);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  addCategoryToPost,
  removeCategoryFromPost,
  getCategoriesByPost,
  getPostsByCategory,
};
