const express = require("express");
const router = express.Router();
const {
  createAdUnit,
  updateAdUnit,
  getAdUnits,
  getAdUnit,
  deleteAdUnit,
  getAdSettings,
  upsertAdSettings,
} = require("../controllers/adUnits.controller");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// Public routes (or authenticated, depending on your needs)
router.get("/",isAuthenticated, isAdmin, getAdUnits); // Get all ad units
router.get("/ad-unit/:id",isAuthenticated, isAdmin, getAdUnit); // Get ad unit by ID
router.get("/ad-settings",isAuthenticated, isAdmin, getAdSettings); // Get ad settings

// Protected routes (admin only)
router.post("/ad-unit", isAuthenticated, isAdmin, createAdUnit); // Create a new ad unit
router.put("/ad-unit/:id", isAuthenticated, isAdmin, updateAdUnit); // Update ad unit
router.delete("/ad-unit/:id", isAuthenticated, isAdmin, deleteAdUnit); // Delete ad unit
router.post("/ad-settings", isAuthenticated, isAdmin, upsertAdSettings); // Create/Update ad settings

module.exports = router;