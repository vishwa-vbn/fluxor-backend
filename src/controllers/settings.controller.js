const Setting = require("../models/settings.model");

exports.createSetting = async (req, res) => {
  try {
    const { key, value, group } = req.body;

    // Validate inputs
    if (!key || value === undefined || value === null) {
      return res.status(400).json({ error: "Key and value are required" });
    }

    const newSetting = await Setting.createSetting({
      key,
      value: String(value), // Convert to string for TEXT column
      group: group || "general",
    });
    res.status(201).json(newSetting);
  } catch (error) {
    console.error("Create Setting Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllSettings = async (req, res) => {
  try {
    const group = req.query.group || null;
    const settings = await Setting.getAllSettings(group);
    res.json(settings);
  } catch (error) {
    console.error("Get All Settings Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getSettingByKey = async (req, res) => {
  try {
    const { key } = req.params;
    const setting = await Setting.getSettingByKey(key);

    if (!setting) {
      return res.status(404).json({ error: "Setting not found" });
    }

    res.json(setting);
  } catch (error) {
    console.error("Get Setting by Key Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    // Validate input
    if (value === undefined || value === null) {
      return res.status(400).json({ error: "Value is required" });
    }

    const updatedSetting = await Setting.updateSetting(key, String(value)); // Convert to string

    if (!updatedSetting) {
      return res.status(404).json({ error: "Setting not found" });
    }

    res.json(updatedSetting);
  } catch (error) {
    console.error("Update Setting Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteSetting = async (req, res) => {
  try {
    const { key } = req.params;

    const deletedSetting = await Setting.deleteSetting(key);

    if (!deletedSetting) {
      return res.status(404).json({ error: "Setting not found" });
    }

    res.json({ message: "Setting deleted successfully" });
  } catch (error) {
    console.error("Delete Setting Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};