const express = require("express");
const router = express.Router();
const {
  createComment,
  getCommentsByPost,
  approveComment,
  rejectComment,
  deleteComment,
} = require("../controllers/comments.controller");

// Create a new comment
router.post("/", createComment);

// Get all comments for a post (optional query ?status=approved/pending/rejected)
router.get("/post/:postId", getCommentsByPost);

// Approve a comment
router.put("/:commentId/approve", approveComment);

// Reject a comment
router.put("/:commentId/reject", rejectComment);

// Delete a comment
router.delete("/:commentId", deleteComment);

module.exports = router;
