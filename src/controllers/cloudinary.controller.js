const cloudinary = require('../config/cloudinaryConfig');
const { successResponse, errorResponse } = require('../utils/response');

// Upload file to blog_assets folder
const uploadFile = async (req, res) => {
  try {
    if (!req.file || !req.body.fileName) {
      return errorResponse(res, 400, 'file and fileName are required');
    }

    // Convert buffer to base64 data URI
    const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const uploadResponse = await cloudinary.uploader.upload(dataUri, {
      public_id: req.body.fileName, // Remove 'blog_assets/' to avoid duplication
      folder: 'blog_assets',
      resource_type: 'auto',
    });

    return successResponse(res, 201, 'File uploaded successfully', {
      assetId: uploadResponse.asset_id, // Return asset_id instead of public_id
      url: uploadResponse.secure_url,
      name: uploadResponse.public_id.split('/').pop(),
      type: uploadResponse.resource_type,
    });
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    return errorResponse(res, 500, error.message || 'Failed to upload file');
  }
};

// List files from blog_assets folder
const listAssets = async (req, res) => {
  try {
    const { type, sort, skip, limit = 100 } = req.query;

    const queryParams = {
      resource_type: type || 'image', // e.g., 'image', 'video', 'raw'
      type: 'upload', // Delivery type, required for SDK
      prefix: 'blog_assets/', // Folder path
      max_results: parseInt(limit) || 100,
      direction: sort || 'asc', // Sorting (asc/desc)
    };

    // Only include next_cursor if skip is a valid, non-zero cursor
    if (skip && skip !== '0') {
      queryParams.next_cursor = skip;
    }

    const assets = await cloudinary.api.resources(queryParams);
    console.log('listAssets result:', assets);

    return successResponse(res, 200, 'Assets retrieved successfully', assets.resources);
  } catch (error) {
    console.error('Error listing assets:', error);
    return errorResponse(res, 500, error.message || 'Failed to list assets');
  }
};

// Get file details by asset_id
const getFileDetails = async (req, res) => {
  try {
    const { assetId } = req.params;

    if (!assetId) {
      return errorResponse(res, 400, 'assetId is required');
    }

    const fileDetails = await cloudinary.api.resource_by_asset_id(assetId);
    return successResponse(res, 200, 'File details retrieved successfully', {
      assetId: fileDetails.asset_id,
      publicId: fileDetails.public_id,
      url: fileDetails.secure_url,
      name: fileDetails.public_id.split('/').pop(),
      type: fileDetails.resource_type,
      createdAt: fileDetails.created_at,
    });
  } catch (error) {
    console.error('Error getting file details:', error);
    return errorResponse(res, 500, error.message || 'Failed to get file details');
  }
};

// Delete file by asset_id
const deleteFile = async (req, res) => {
  try {
    const { assetId } = req.params;
    console.log('Received assetId:', assetId); // Debug log

    if (!assetId) {
      return errorResponse(res, 400, 'assetId is required');
    }

    // Fetch public_id using asset_id
    const assetDetails = await cloudinary.api.resource_by_asset_id(assetId);
    console.log('Fetched assetDetails:', assetDetails); // Debug log

    if (!assetDetails || !assetDetails.public_id) {
      return errorResponse(res, 404, 'Asset not found');
    }

    const result = await cloudinary.uploader.destroy(assetDetails.public_id, {
      resource_type: 'image',
      type: 'upload',
      invalidate: true,
    });
    console.log('Destroy result:', result); // Debug log

    if (result.result !== 'ok') {
      return errorResponse(res, 400, `Failed to delete asset: ${result.result}`);
    }

    return successResponse(res, 200, 'File deleted successfully');
  } catch (error) {
    console.error('Error deleting file:', error);
    return errorResponse(res, 500, error.message || 'Failed to delete file');
  }
};

module.exports = {
  uploadFile,
  listAssets,
  getFileDetails,
  deleteFile,
};