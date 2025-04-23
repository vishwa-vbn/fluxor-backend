const ImageKit = require("imagekit");
const { successResponse, errorResponse } = require("../utils/response");
require("dotenv").config();

// Initialize ImageKit
const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// List files from ad_units folder
const listAssets = async (req, res) => {
  try {
    const { type, sort, skip = 0, limit = 100 } = req.query;

    const queryParams = {
      path: "/ad_units/", // Hardcoded to ad_units
      skip: parseInt(skip),
      limit: parseInt(limit),
      includeFolder: false, // Exclude folders, only files
    };

    if (type) {
      queryParams.type = type; // e.g., "file"
    }

    if (sort) {
      queryParams.sort = sort; // e.g., "ASC_NAME"
    }

    const assets = await imageKit.listFiles(queryParams);
    console.log("listAssets result:", assets);

    return successResponse(res, 200, "Assets retrieved successfully", assets);
  } catch (error) {
    console.error("Error listing assets:", error.message);
    return errorResponse(res, 500, error.message);
  }
};

// Get file details
const getFileDetails = async (req, res) => {
  try {
    const { fileId } = req.params;

    if (!fileId) {
      return errorResponse(res, 400, "fileId is required");
    }

    const fileDetails = await imageKit.getFileDetails(fileId);

    return successResponse(
      res,
      200,
      "File details retrieved successfully",
      fileDetails
    );
  } catch (error) {
    console.error("Error getting file details:", error.message);
    return errorResponse(res, 500, error.message);
  }
};

// Update file details
const updateFileDetails = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { tags, customCoordinates, isPublished, customMetadata } = req.body;

    if (!fileId) {
      return errorResponse(res, 400, "fileId is required");
    }

    const updateData = {};
    if (tags) updateData.tags = Array.isArray(tags) ? tags : JSON.parse(tags);
    if (customCoordinates) updateData.customCoordinates = customCoordinates;
    if (typeof isPublished === "boolean") updateData.isPublished = isPublished;
    if (customMetadata)
      updateData.customMetadata =
        typeof customMetadata === "string"
          ? JSON.parse(customMetadata)
          : customMetadata;

    const updatedFile = await imageKit.updateFileDetails(fileId, updateData);

    return successResponse(
      res,
      200,
      "File details updated successfully",
      updatedFile
    );
  } catch (error) {
    console.error("Error updating file details:", error.message);
    return errorResponse(res, 500, error.message);
  }
};

// Delete file
const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    if (!fileId) {
      return errorResponse(res, 400, "fileId is required");
    }

    await imageKit.deleteFile(fileId);

    return successResponse(res, 200, "File deleted successfully");
  } catch (error) {
    console.error("Error deleting file:", error.message);
    return errorResponse(res, 500, error.message);
  }
};

// Upload file to ad_units
const uploadFile = async (req, res) => {
  try {
    const { file, fileName } = req.body;

    if (!file || !fileName) {
      return errorResponse(res, 400, "file and fileName are required");
    }

    const uploadResponse = await imageKit.upload({
      file: Buffer.from(file.buffer), // Assuming file is sent as buffer
      fileName,
      folder: "/ad_units/", // Hardcoded to ad_units
    });

    return successResponse(res, 201, "File uploaded successfully", uploadResponse);
  } catch (error) {
    console.error("Error uploading file:", error.message);
    return errorResponse(res, 500, error.message);
  }
};

// Rename file
const renameFile = async (req, res) => {
  try {
    const { fileId, newFileName } = req.body;

    if (!fileId || !newFileName) {
      return errorResponse(res, 400, "fileId and newFileName are required");
    }

    await imageKit.updateFileDetails(fileId, { name: newFileName });

    return successResponse(res, 200, "File renamed successfully");
  } catch (error) {
    console.error("Error renaming file:", error.message);
    return errorResponse(res, 500, error.message);
  }
};

module.exports = {
  listAssets,
  getFileDetails,
  updateFileDetails,
  deleteFile,
  uploadFile,
  renameFile,
};