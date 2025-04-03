const express = require("express");
const router = express.Router();
const {
  addTagToPost,
  removeTagFromPost,
  getTagsByPost,
  getPostsByTag,
} = require("../controllers/postTags.controller");

// Add a tag to a post
router.post("/", addTagToPost);

// Remove a tag from a post
router.delete("/", removeTagFromPost);

// Get all tags for a specific post
router.get("/post/:postId", getTagsByPost);

// Get all posts under a specific tag
router.get("/tag/:tagId", getPostsByTag);

module.exports = router;
