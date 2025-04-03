const Tag = require("../models/tags.model");

exports.createTag = async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    const tag = await Tag.createTag(name, slug, description);
    res.status(201).json(tag);
  } catch (error) {
    console.error("Create Tag Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllTags = async (req, res) => {
  try {
    const tags = await Tag.getAllTags();
    res.json(tags);
  } catch (error) {
    console.error("Get All Tags Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getTagById = async (req, res) => {
  try {
    const tag = await Tag.getTagById(req.params.id);
    if (!tag) return res.status(404).json({ error: "Tag not found" });
    res.json(tag);
  } catch (error) {
    console.error("Get Tag by ID Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateTag = async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    const tag = await Tag.updateTag(req.params.id, name, slug, description);
    if (!tag) return res.status(404).json({ error: "Tag not found" });
    res.json(tag);
  } catch (error) {
    console.error("Update Tag Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteTag = async (req, res) => {
  try {
    const tag = await Tag.deleteTag(req.params.id);
    if (!tag) return res.status(404).json({ error: "Tag not found" });
    res.json({ message: "Tag deleted successfully" });
  } catch (error) {
    console.error("Delete Tag Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
