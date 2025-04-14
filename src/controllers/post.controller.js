const postModel = require("../models/post.model");
const { successResponse, errorResponse } = require("../utils/response");

// Create a new post
async function createPostHandler(req, res) {
  try {
    const postData = req.body;
    const post = await postModel.createPost(postData);
    return successResponse(res, 201, "Post created successfully", post);
  } catch (error) {
    return errorResponse(res, error);
  }
}

// Get a post by ID
async function getPostByIdHandler(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const post = await postModel.getPostById(id);
    if (!post) return errorResponse(res, new Error("Post not found"), 404);
    return successResponse(res, 200, "Post retrieved successfully", post);
  } catch (error) {
    return errorResponse(res, error);
  }
}

// Get a post by slug
async function getPostBySlugHandler(req, res) {
  try {
    const slug = req.params.slug;
    const post = await postModel.getPostBySlug(slug);
    if (!post) return errorResponse(res, new Error("Post not found"), 404);
    return successResponse(res, 200, "Post retrieved successfully", post);
  } catch (error) {
    return errorResponse(res, error);
  }
}

// Get all published posts with pagination
async function getAllPublishedPostsHandler(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const posts = await postModel.getAllPublishedPosts(page, limit);
    return successResponse(
      res,
      200,
      "Published posts retrieved successfully",
      posts
    );
  } catch (error) {
    return errorResponse(res, error);
  }
}

async function getAllPostsHandler(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const posts = await postModel.getAllPosts(page, limit);
    return successResponse(res, 200, "All posts retrieved successfully", posts);
  } catch (error) {
    return errorResponse(res, error);
  }
}

// Update a post by ID
async function updatePostHandler(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const updatedPost = await postModel.updatePost(id, req.body);
    if (!updatedPost)
      return errorResponse(res, new Error("Post not found"), 404);
    return successResponse(res, 200, "Post updated successfully", updatedPost);
  } catch (error) {
    return errorResponse(res, error);
  }
}

// Delete a post by ID
async function deletePostHandler(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const deletedPost = await postModel.deletePost(id);
    if (!deletedPost)
      return errorResponse(res, new Error("Post not found"), 404);
    return successResponse(res, 200, "Post deleted successfully", deletedPost);
  } catch (error) {
    return errorResponse(res, error);
  }
}

module.exports = {
  createPostHandler,
  getPostByIdHandler,
  getPostBySlugHandler,
  getAllPublishedPostsHandler,
  getAllPostsHandler,
  updatePostHandler,
  deletePostHandler,
};
