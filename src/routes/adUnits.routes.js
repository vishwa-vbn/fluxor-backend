const express = require("express");
const router = express.Router();
const {
  createAdUnit,
  getAllAdUnits,
  getAdUnitsByPlacement,
  updateAdUnit,
  activateAdUnit,
  deactivateAdUnit,
  deleteAdUnit,
} = require("../controllers/adUnits.controller");

// Create an Ad Unit
router.post("/", createAdUnit);

// Get all Ad Units (optional query ?active=true to get only active ones)
router.get("/", getAllAdUnits);

// Get Ad Units by placement
router.get("/placement/:placement", getAdUnitsByPlacement);

// Update an Ad Unit
router.put("/:id", updateAdUnit);

// Activate an Ad Unit
router.put("/:id/activate", activateAdUnit);

// Deactivate an Ad Unit
router.put("/:id/deactivate", deactivateAdUnit);

// Delete an Ad Unit
router.delete("/:id", deleteAdUnit);

module.exports = router;
