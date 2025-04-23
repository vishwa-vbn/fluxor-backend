const express = require("express");
const router = express.Router();
const {
  listAssets,
  getFileDetails,
  updateFileDetails,
  deleteFile,
  uploadFile,
  renameFile,
} = require("../controllers/imagekit.controller");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

router.get("/assets", isAuthenticated, isAdmin, listAssets); // List ad_units files
router.get("/files/:fileId", isAuthenticated, isAdmin, getFileDetails); // Get file details
router.patch("/files/:fileId", isAuthenticated, isAdmin, updateFileDetails); // Update file details
router.delete("/files/:fileId", isAuthenticated, isAdmin, deleteFile); // Delete file
router.post("/upload", isAuthenticated, isAdmin, uploadFile); // Upload file to ad_units
router.put("/rename", isAuthenticated, isAdmin, renameFile); // Rename file

module.exports = router;