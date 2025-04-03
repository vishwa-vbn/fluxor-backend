const express = require("express");
const router = express.Router();
const {
  createSetting,
  getAllSettings,
  getSettingByKey,
  updateSetting,
  deleteSetting,
} = require("../controllers/settings.controller");

// Create a new setting
router.post("/", createSetting);

// Get all settings (optional: filter by group using ?group=general)
router.get("/", getAllSettings);

// Get a specific setting by key
router.get("/:key", getSettingByKey);

// Update a setting by key
router.put("/:key", updateSetting);

// Delete a setting by key
router.delete("/:key", deleteSetting);

module.exports = router;
