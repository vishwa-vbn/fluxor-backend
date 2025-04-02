const postModel = require("../models/post.model"); // Import directly from model

const { successResponse, errorResponse } = require("../utils/response");

// Create a new post
async function createPostHandler(req, res) {
  try {
    const post = await postModel.createPost(req.body);
    return successResponse(res, 201, "Post created successfully", post);
  } catch (error) {
    return errorResponse(res, error);
  }
}

// Get a post by ID
async function getPostByIdHandler(req, res) {
  try {
    const post = await postModel.getPostById(parseInt(req.params.id));
    if (!post) return errorResponse(res, new Error("Post not found"), 404);
    return successResponse(res, 200, "Post retrieved successfully", post);
  } catch (error) {
    return errorResponse(res, error);
  }
}

// Get a post by slug
async function getPostBySlugHandler(req, res) {
  try {
    const post = await postModel.getPostBySlug(req.params.slug);
    if (!post) return errorResponse(res, new Error("Post not found"), 404);
    return successResponse(res, 200, "Post retrieved successfully", post);
  } catch (error) {
    return errorResponse(res, error);
  }
}

// Get all published posts with pagination
async function getAllPublishedPostsHandler(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const categorySlug = req.query.category;
    const tagSlug = req.query.tag;
    const search = req.query.search;

    const posts = await postModel.getAllPublishedPosts({ page, limit, categorySlug, tagSlug, search });
    return successResponse(res, 200, "Posts retrieved successfully", posts);
  } catch (error) {
    return errorResponse(res, error);
  }
}

// Update a post
async function updatePostHandler(req, res) {
  try {
    const postId = parseInt(req.params.id);
    const post = await postModel.updatePost(postId, req.body);
    if (!post) return errorResponse(res, new Error("Post not found"), 404);
    return successResponse(res, 200, "Post updated successfully", post);
  } catch (error) {
    return errorResponse(res, error);
  }
}

// Delete a post
async function deletePostHandler(req, res) {
  try {
    const postId = parseInt(req.params.id);
    await postModel.deletePost(postId);
    return successResponse(res, 200, "Post deleted successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
}

module.exports = {
  createPostHandler,
  getPostByIdHandler,
  getPostBySlugHandler,
  getAllPublishedPostsHandler,
  updatePostHandler,
  deletePostHandler,
};
