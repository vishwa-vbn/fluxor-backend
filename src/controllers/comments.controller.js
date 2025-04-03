const Comment = require("../models/comments.model");

exports.createComment = async (req, res) => {
  try {
    const newComment = await Comment.createComment(req.body);
    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { status } = req.query;
    const comments = await Comment.getCommentsByPost(postId, status);
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.approveComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const updatedComment = await Comment.updateCommentStatus(commentId, "approved");
    res.json(updatedComment);
  } catch (error) {
    console.error("Error approving comment:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.rejectComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const updatedComment = await Comment.updateCommentStatus(commentId, "rejected");
    res.json(updatedComment);
  } catch (error) {
    console.error("Error rejecting comment:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const deletedComment = await Comment.deleteComment(commentId);
    res.json(deletedComment);
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Server error" });
  }
};
