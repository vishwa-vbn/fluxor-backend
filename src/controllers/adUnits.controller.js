const AdUnit = require("../models/adUnits.model");

exports.createAdUnit = async (req, res) => {
  try {
    const newAdUnit = await AdUnit.createAdUnit(req.body);
    res.status(201).json(newAdUnit);
  } catch (error) {
    console.error("Error creating ad unit:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllAdUnits = async (req, res) => {
  try {
    const activeOnly = req.query.active === "true";
    const adUnits = await AdUnit.getAllAdUnits(activeOnly);
    res.json(adUnits);
  } catch (error) {
    console.error("Error fetching ad units:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAdUnitsByPlacement = async (req, res) => {
  try {
    const { placement } = req.params;
    const adUnits = await AdUnit.getAdUnitsByPlacement(placement);
    res.json(adUnits);
  } catch (error) {
    console.error("Error fetching ad units by placement:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateAdUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAdUnit = await AdUnit.updateAdUnit(id, req.body);
    res.json(updatedAdUnit);
  } catch (error) {
    console.error("Error updating ad unit:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.activateAdUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAdUnit = await AdUnit.updateAdUnitStatus(id, true);
    res.json(updatedAdUnit);
  } catch (error) {
    console.error("Error activating ad unit:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deactivateAdUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAdUnit = await AdUnit.updateAdUnitStatus(id, false);
    res.json(updatedAdUnit);
  } catch (error) {
    console.error("Error deactivating ad unit:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteAdUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAdUnit = await AdUnit.deleteAdUnit(id);
    res.json(deletedAdUnit);
  } catch (error) {
    console.error("Error deleting ad unit:", error);
    res.status(500).json({ error: "Server error" });
  }
};
