const Setting = require("../models/settings.model");

exports.createSetting = async (req, res) => {
  try {
    const newSetting = await Setting.createSetting(req.body);
    res.status(201).json(newSetting);
  } catch (error) {
    console.error("Error creating setting:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllSettings = async (req, res) => {
  try {
    const group = req.query.group || null;
    const settings = await Setting.getAllSettings(group);
    res.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
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
    console.error("Error fetching setting:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    const updatedSetting = await Setting.updateSetting(key, value);

    if (!updatedSetting) {
      return res.status(404).json({ error: "Setting not found" });
    }

    res.json(updatedSetting);
  } catch (error) {
    console.error("Error updating setting:", error);
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
    console.error("Error deleting setting:", error);
    res.status(500).json({ error: "Server error" });
  }
};
