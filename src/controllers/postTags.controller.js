const PostTag = require("../models/postTags.model");

exports.addTagToPost = async (req, res) => {
  try {
    const { postId, tagId } = req.body;
    const postTag = await PostTag.addTagToPost(postId, tagId);
    res.status(201).json({ message: "Tag added to post successfully", postTag });
  } catch (error) {
    console.error("Error adding tag to post:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.removeTagFromPost = async (req, res) => {
  try {
    const { postId, tagId } = req.body;
    const deletedTag = await PostTag.removeTagFromPost(postId, tagId);
    if (!deletedTag) {
      return res.status(404).json({ message: "Tag not found for this post" });
    }
    res.json({ message: "Tag removed from post successfully" });
  } catch (error) {
    console.error("Error removing tag from post:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getTagsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const tags = await PostTag.getTagsByPost(postId);
    res.json(tags);
  } catch (error) {
    console.error("Error fetching tags for post:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getPostsByTag = async (req, res) => {
  try {
    const { tagId } = req.params;
    const posts = await PostTag.getPostsByTag(tagId);
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts for tag:", error);
    res.status(500).json({ error: "Server error" });
  }
};
