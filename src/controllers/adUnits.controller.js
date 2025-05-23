// const { AdUnit, AdSettings } = require("../models/adUnits.model"); // Updated to include AdSettings
// const ImageKit = require("imagekit");
// const multer = require("multer");
// const { successResponse, errorResponse } = require("../utils/response");
// require("dotenv").config();

// // Initialize ImageKit
// const imageKit = new ImageKit({
//   publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
//   privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
//   urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
// });

// // Configure Multer for file handling
// const storage = multer.memoryStorage();
// const upload = multer({
//   storage,
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = ["image/jpeg", "image/png", "video/mp4", "video/webm"];
//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(
//         new Error(
//           "Invalid file type. Only JPEG, PNG, MP4, and WebM are allowed."
//         )
//       );
//     }
//   },
// }).single("file");

// const createAdUnit = async (req, res) => {
//   try {
//     upload(req, res, async (err) => {
//       if (err) {
//         return errorResponse(res, 400, err.message);
//       }

//       const {
//         name,
//         code,
//         ad_type,
//         placement,
//         dimensions,
//         is_active,
//         target_pages,
//         target_audience,
//         schedule,
//         priority,
//         status,
//         custom_content, // Already an object
//       } = req.body;

//       // Validate ad_type
//       const validAdTypes = ["banner", "video", "native"];
//       if (!validAdTypes.includes(ad_type)) {
//         return errorResponse(
//           res,
//           400,
//           `Invalid ad_type. Must be one of: ${validAdTypes.join(", ")}`
//         );
//       }

//       // Validate custom_content (if provided)
//       let parsedCustomContent = {};
//       if (custom_content) {
//         if (typeof custom_content !== "object" || Array.isArray(custom_content)) {
//           return errorResponse(
//             res,
//             400,
//             "custom_content must be a valid object"
//           );
//         }
//         parsedCustomContent = custom_content; // Use as-is, no JSON.parse needed
//       }

//       let custom_file_id = null;

//       // Handle file upload only if a file is provided
//       if (req.file) {
//         const uploadResponse = await imageKit.upload({
//           file: req.file.buffer,
//           fileName: `${Date.now()}_${req.file.originalname}`,
//           folder: "/ad_units",
//           tags: ["ad", ad_type],
//         });

//         custom_file_id = uploadResponse.fileId;

//         if (ad_type === "banner") {
//           const optimizedUrl = imageKit.url({
//             src: uploadResponse.url,
//             transformation: [
//               {
//                 height: dimensions?.height || "300",
//                 width: dimensions?.width || "300",
//                 quality: "80",
//                 format: "webp",
//               },
//             ],
//           });
//           parsedCustomContent.image_url = optimizedUrl;
//         } else if (ad_type === "video") {
//           parsedCustomContent.video_url = uploadResponse.url;
//         }
//       } else {
//         // If no file is uploaded, retain custom_content as provided (e.g., external URLs)
//         // Optionally validate URLs here if needed
//         if (
//           parsedCustomContent.image_url &&
//           !isValidUrl(parsedCustomContent.image_url)
//         ) {
//           return errorResponse(res, 400, "Invalid image_url in custom_content");
//         }
//         if (
//           parsedCustomContent.youtube_url &&
//           !isValidUrl(parsedCustomContent.youtube_url)
//         ) {
//           return errorResponse(
//             res,
//             400,
//             "Invalid youtube_url in custom_content"
//           );
//         }
//       }

//       // Parse other fields that may be stringified
//       const parsedDimensions = dimensions
//         ? typeof dimensions === "string"
//           ? JSON.parse(dimensions)
//           : dimensions
//         : null;
//       const parsedTargetPages = target_pages
//         ? typeof target_pages === "string"
//           ? JSON.parse(target_pages)
//           : target_pages
//         : null;
//       const parsedTargetAudience = target_audience
//         ? typeof target_audience === "string"
//           ? JSON.parse(target_audience)
//           : target_audience
//         : null;
//       const parsedSchedule = schedule
//         ? typeof schedule === "string"
//           ? JSON.parse(schedule)
//           : schedule
//         : null;

//       const adUnitData = {
//         name,
//         code: code || `AD-${Date.now()}`,
//         ad_type,
//         placement,
//         custom_content: parsedCustomContent,
//         custom_file_id,
//         dimensions: parsedDimensions,
//         is_active: is_active === "true" || is_active === true,
//         target_pages: parsedTargetPages,
//         target_audience: parsedTargetAudience,
//         schedule: parsedSchedule,
//         priority: priority ? parseInt(priority) : 0,
//         status: status || "active",
//       };

//       const newAdUnit = await AdUnit.createAdUnit(adUnitData);
//       return successResponse(
//         res,
//         201,
//         "Ad unit created successfully",
//         newAdUnit
//       );
//     });
//   } catch (error) {
//     return errorResponse(res, 500, error.message);
//   }
// };

// // Utility function to validate URLs
// function isValidUrl(url) {
//   try {
//     new URL(url);
//     return true;
//   } catch {
//     return false;
//   }
// }
// const updateAdUnit = async (req, res) => {
//   try {
//     upload(req, res, async (err) => {
//       if (err) {
//         return errorResponse(res, 400, err.message);
//       }

//       const { id } = req.params;
//       const {
//         name,
//         code,
//         ad_type,
//         placement,
//         dimensions,
//         is_active,
//         target_pages,
//         target_audience,
//         schedule,
//         priority,
//         status,
//         custom_content, // Already an object
//       } = req.body;

//       // Validate ad_type
//       const validAdTypes = ["banner", "video", "native"];
//       if (ad_type && !validAdTypes.includes(ad_type)) {
//         return errorResponse(
//           res,
//           400,
//           `Invalid ad_type. Must be one of: ${validAdTypes.join(", ")}`
//         );
//       }

//       // Validate custom_content (if provided)
//       let parsedCustomContent = {};
//       if (custom_content) {
//         if (typeof custom_content !== "object" || Array.isArray(custom_content)) {
//           return errorResponse(
//             res,
//             400,
//             "custom_content must be a valid object"
//           );
//         }
//         parsedCustomContent = custom_content; // Use as-is, no JSON.parse needed
//       }

//       let custom_file_id = null;

//       // Handle file upload only if a file is provided
//       if (req.file) {
//         const uploadResponse = await imageKit.upload({
//           file: req.file.buffer,
//           fileName: `${Date.now()}_${req.file.originalname}`,
//           folder: "/ad_units",
//           tags: ["ad", ad_type],
//         });

//         custom_file_id = uploadResponse.fileId;

//         if (ad_type === "banner") {
//           const optimizedUrl = imageKit.url({
//             src: uploadResponse.url,
//             transformation: [
//               {
//                 height: dimensions?.height || "300",
//                 width: dimensions?.width || "300",
//                 quality: "80",
//                 format: "webp",
//               },
//             ],
//           });
//           parsedCustomContent.image_url = optimizedUrl;
//         } else if (ad_type === "video") {
//           parsedCustomContent.video_url = uploadResponse.url;
//         }
//       } else {
//         // If no file is uploaded, retain custom_content as provided (e.g., external URLs)
//         // Optionally validate URLs here if needed
//         if (
//           parsedCustomContent.image_url &&
//           !isValidUrl(parsedCustomContent.image_url)
//         ) {
//           return errorResponse(res, 400, "Invalid image_url in custom_content");
//         }
//         if (
//           parsedCustomContent.youtube_url &&
//           !isValidUrl(parsedCustomContent.youtube_url)
//         ) {
//           return errorResponse(
//             res,
//             400,
//             "Invalid youtube_url in custom_content"
//           );
//         }
//       }

//       // Parse other fields that may be stringified
//       const parsedDimensions = dimensions
//         ? typeof dimensions === "string"
//           ? JSON.parse(dimensions)
//           : dimensions
//         : null;
//       const parsedTargetPages = target_pages
//         ? typeof target_pages === "string"
//           ? JSON.parse(target_pages)
//           : target_pages
//         : null;
//       const parsedTargetAudience = target_audience
//         ? typeof target_audience === "string"
//           ? JSON.parse(target_audience)
//           : target_audience
//         : null;
//       const parsedSchedule = schedule
//         ? typeof schedule === "string"
//           ? JSON.parse(schedule)
//           : schedule
//         : null;

//       const updateData = {
//         name,
//         code: code || `AD-${Date.now()}`,
//         ad_type,
//         placement,
//         custom_content: parsedCustomContent,
//         custom_file_id,
//         dimensions: parsedDimensions,
//         is_active: is_active === "true" || is_active === true,
//         target_pages: parsedTargetPages,
//         target_audience: parsedTargetAudience,
//         schedule: parsedSchedule,
//         priority: priority ? parseInt(priority) : 0,
//         status: status || "active",
//       };

//       const updatedAdUnit = await AdUnit.updateAdUnit(id, updateData);
//       if (!updatedAdUnit) {
//         return errorResponse(res, 404, "Ad unit not found");
//       }

//       return successResponse(
//         res,
//         200,
//         "Ad unit updated successfully",
//         updatedAdUnit
//       );
//     });
//   } catch (error) {
//     return errorResponse(res, 500, error.message);
//   }
// };



// // Get all ad units
// const getAdUnits = async (req, res) => {
//   try {
//     const { activeOnly, status } = req.query;
//     const allAdUnits = await AdUnit.getAllAdUnits({
//       activeOnly: activeOnly === "true",
//       status,
//     });
//     return successResponse(
//       res,
//       200,
//       "Ad units retrieved successfully",
//       allAdUnits
//     );
//   } catch (error) {
//     return errorResponse(res, 500, error.message);
//   }
// };

// // Get single ad unit
// const getAdUnit = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const adUnit = await AdUnit.getAdUnitById(id);
//     if (!adUnit) {
//       return errorResponse(res, 404, "Ad unit not found");
//     }
//     return successResponse(res, 200, "Ad unit retrieved successfully", adUnit);
//   } catch (error) {
//     return errorResponse(res, 500, error.message);
//   }
// };

// // Delete ad unit
// const deleteAdUnit = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const adUnit = await AdUnit.getAdUnitById(id);
//     if (!adUnit) {
//       return errorResponse(res, 404, "Ad unit not found");
//     }

//     const { custom_content, custom_file_id } = adUnit;
//     console.log(`custom_content for ad unit ${id}:`, custom_content);
//     console.log(`custom_file_id for ad unit ${id}:`, custom_file_id);

//     if (custom_file_id) {
//       try {
//         await imageKit.deleteFile(custom_file_id);
//         console.log(
//           `Deleted ImageKit file: ${custom_file_id} for ad unit ${id}`
//         );
//       } catch (imageKitError) {
//         console.error(
//           `Failed to delete ImageKit file for ad unit ${id}:`,
//           imageKitError.message,
//           imageKitError
//         );
//       }
//     } else {
//       console.log(
//         `No custom_file_id found for ad unit ${id}, skipping ImageKit deletion`
//       );
//     }

//     const deleted = await AdUnit.deleteAdUnit(id);
//     if (!deleted) {
//       return errorResponse(res, 404, "Ad unit not found");
//     }

//     return successResponse(
//       res,
//       200,
//       "Ad unit and associated file deleted successfully"
//     );
//   } catch (error) {
//     console.error(
//       `Error deleting ad unit ${req.params.id}:`,
//       error.message,
//       error
//     );
//     return errorResponse(res, 500, error.message);
//   }
// };

// // New AdSettings APIs

// // Get ad settings
// const getAdSettings = async (req, res) => {
//   try {
//     const adSettings = await AdSettings.getAdSettings();
//     if (!adSettings) {
//       return errorResponse(res, 404, "Ad settings not found");
//     }
//     return successResponse(
//       res,
//       200,
//       "Ad settings retrieved successfully",
//       adSettings
//     );
//   } catch (error) {
//     return errorResponse(res, 500, error.message);
//   }
// };

// const upsertAdSettings = async (req, res) => {
//   try {
//     const {
//       id,
//       publisher_id,
//       ad_client,
//       placements,
//       ad_density,
//       ad_format,
//       target_pages,
//     } = req.body;

//     // Validate publisher_id and ad_client
//     if (!publisher_id || !ad_client) {
//       return errorResponse(res, 400, "publisher_id and ad_client are required");
//     }

//     // Validate ad_density
//     const validDensities = ["low", "balanced", "high"];
//     if (!ad_density || !validDensities.includes(ad_density.toLowerCase())) {
//       return errorResponse(
//         res,
//         400,
//         `ad_density must be one of: ${validDensities.join(", ")}`
//       );
//     }

//     // Validate ad_format
//     const validFormats = ["responsive", "banner", "native"];
//     if (!ad_format || !validFormats.includes(ad_format.toLowerCase())) {
//       return errorResponse(
//         res,
//         400,
//         `ad_format must be one of: ${validFormats.join(", ")}`
//       );
//     }

//     // Validate target_pages (treat as string, no JSON parsing)
//     const validTargetPages = ["all", "posts", "home", "custom"];
//     let dbTargetPages = null;
//     if (target_pages) {
//       if (typeof target_pages !== "string") {
//         return errorResponse(res, 400, "target_pages must be a string");
//       }
//       if (!validTargetPages.includes(target_pages.toLowerCase())) {
//         return errorResponse(
//           res,
//           400,
//           `target_pages must be one of: ${validTargetPages.join(", ")}`
//         );
//       }
//       dbTargetPages = target_pages.toLowerCase();
//     }

//     // Validate and prepare placements (jsonb)
//     let dbPlacements = null;
//     if (placements) {
//       if (!Array.isArray(placements)) {
//         return errorResponse(res, 400, "placements must be an array");
//       }
//       // Ensure placements are valid strings
//       const validPlacements = [
//         "header",
//         "sidebar",
//         "in_content",
//         "footer",
//         "custom",
//       ];
//       const invalidPlacements = placements.filter(
//         (p) => !validPlacements.includes(p.toLowerCase())
//       );
//       if (invalidPlacements.length > 0) {
//         return errorResponse(
//           res,
//           400,
//           `Invalid placements: ${invalidPlacements.join(
//             ", "
//           )}. Must be one of: ${validPlacements.join(", ")}`
//         );
//       }
//       dbPlacements = JSON.stringify(placements.map((p) => p.toLowerCase()));
//     }

//     // Prepare data for database
//     const adSettingsData = {
//       id: id || undefined, // Include id for updates, undefined for inserts
//       publisher_id,
//       ad_client,
//       placements: dbPlacements,
//       ad_density: ad_density.toLowerCase(),
//       ad_format: ad_format.toLowerCase(),
//       target_pages: dbTargetPages,
//     };

//     // Upsert ad settings
//     const updatedAdSettings = await AdSettings.upsertAdSettings(adSettingsData);
//     return successResponse(
//       res,
//       200,
//       "Ad settings updated successfully",
//       updatedAdSettings
//     );
//   } catch (error) {
//     return errorResponse(res, 500, error.message);
//   }
// };

// module.exports = {
//   createAdUnit,
//   updateAdUnit,
//   getAdUnits,
//   getAdUnit,
//   deleteAdUnit,
//   getAdSettings, // New endpoint
//   upsertAdSettings, // New endpoint
// };





const { AdUnit, AdSettings } = require("../models/adUnits.model");
const ImageKit = require("imagekit");
const multer = require("multer");
const { successResponse, errorResponse } = require("../utils/response");
require("dotenv").config();

// Initialize ImageKit
const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Configure Multer for file handling
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "video/mp4", "video/webm"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, PNG, MP4, and WebM are allowed."
        )
      );
    }
  },
}).single("file");

const createAdUnit = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return errorResponse(res, 400, err.message);
      }

      let {
        name,
        code,
        ad_type,
        placement,
        dimensions,
        is_active,
        target_pages,
        target_audience,
        schedule,
        priority,
        status,
        custom_content,
      } = req.body;

      // Parse data field if FormData is used
      if (req.body.data) {
        try {
          const parsedData = JSON.parse(req.body.data);
          ({
            name,
            code,
            ad_type,
            placement,
            dimensions,
            is_active,
            target_pages,
            target_audience,
            schedule,
            priority,
            status,
            custom_content,
          } = parsedData);
        } catch (parseError) {
          return errorResponse(res, 400, "Invalid data field format");
        }
      }

      // Validate required fields
      if (!name || !ad_type) {
        return errorResponse(res, 400, "name and ad_type are required");
      }

      // Validate ad_type
      const validAdTypes = ["banner", "video", "native"];
      if (!validAdTypes.includes(ad_type)) {
        return errorResponse(
          res,
          400,
          `Invalid ad_type. Must be one of: ${validAdTypes.join(", ")}`
        );
      }

      // Validate custom_content (if provided)
      let parsedCustomContent = {};
      if (custom_content) {
        if (typeof custom_content !== "object" || Array.isArray(custom_content)) {
          return errorResponse(
            res,
            400,
            "custom_content must be a valid object"
          );
        }
        parsedCustomContent = custom_content;
      }

      let custom_file_id = null;

      // Handle file upload
      if (req.file) {
        const uploadResponse = await imageKit.upload({
          file: req.file.buffer,
          fileName: `${Date.now()}_${req.file.originalname}`,
          folder: "/ad_units",
          tags: ["ad", ad_type],
        });

        custom_file_id = uploadResponse.fileId;

        if (ad_type === "banner") {
          const optimizedUrl = imageKit.url({
            src: uploadResponse.url,
            transformation: [
              {
                height: dimensions?.height || "300",
                width: dimensions?.width || "300",
                quality: "80",
                format: "webp",
              },
            ],
          });
          parsedCustomContent.image_url = optimizedUrl;
        } else if (ad_type === "video") {
          parsedCustomContent.youtube_url = uploadResponse.url;
        }
      } else {
        // Validate URLs if provided
        if (
          parsedCustomContent.image_url &&
          !isValidUrl(parsedCustomContent.image_url)
        ) {
          return errorResponse(res, 400, "Invalid image_url in custom_content");
        }
        if (
          parsedCustomContent.youtube_url &&
          !isValidUrl(parsedCustomContent.youtube_url)
        ) {
          return errorResponse(
            res,
            400,
            "Invalid youtube_url in custom_content"
          );
        }
      }

      // Parse stringified fields
      const parsedDimensions = dimensions
        ? typeof dimensions === "string"
          ? JSON.parse(dimensions)
          : dimensions
        : null;
      const parsedTargetPages = target_pages
        ? typeof target_pages === "string"
          ? JSON.parse(target_pages)
          : target_pages
        : null;
      const parsedTargetAudience = target_audience
        ? typeof target_audience === "string"
          ? JSON.parse(target_audience)
          : target_audience
        : null;
      const parsedSchedule = schedule
        ? typeof schedule === "string"
          ? JSON.parse(schedule)
          : schedule
        : null;

      const adUnitData = {
        name,
        code: code || `AD-${Date.now()}`,
        ad_type,
        placement: placement || "header",
        custom_content: parsedCustomContent,
        custom_file_id,
        dimensions: parsedDimensions,
        is_active: is_active === "true" || is_active === true,
        target_pages: parsedTargetPages,
        target_audience: parsedTargetAudience,
        schedule: parsedSchedule,
        priority: priority ? parseInt(priority) : 0,
        status: status || "active",
      };

      const newAdUnit = await AdUnit.createAdUnit(adUnitData);
      return successResponse(
        res,
        201,
        "Ad unit created successfully",
        newAdUnit
      );
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const updateAdUnit = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return errorResponse(res, 400, err.message);
      }

      const { id } = req.params;
      let {
        name,
        code,
        ad_type,
        placement,
        dimensions,
        is_active,
        target_pages,
        target_audience,
        schedule,
        priority,
        status,
        custom_content,
      } = req.body;

      // Validate status
      const validStatuses = ['active', 'paused', 'archived'];
      if (status && !validStatuses.includes(status)) {
        return errorResponse(
          res,
          400,
          `Invalid status. Must be one of: ${validStatuses.join(", ")}`
        );
      }

      // Ensure is_active and status are consistent (optional, based on your logic)
      if (status === 'active' && is_active === false) {
        return errorResponse(
          res,
          400,
          "Cannot set status to 'active' when is_active is false"
        );
      }
      // Parse data field if FormData is used
      if (req.body.data) {
        try {
          const parsedData = JSON.parse(req.body.data);
          ({
            name,
            code,
            ad_type,
            placement,
            dimensions,
            is_active,
            target_pages,
            target_audience,
            schedule,
            priority,
            status,
            custom_content,
          } = parsedData);
        } catch (parseError) {
          return errorResponse(res, 400, "Invalid data field format");
        }
      }

      // Validate required fields
      if (!name) {
        return errorResponse(res, 400, "name is required");
      }

      // Validate ad_type if provided
      if (ad_type) {
        const validAdTypes = ["banner", "video", "native"];
        if (!validAdTypes.includes(ad_type)) {
          return errorResponse(
            res,
            400,
            `Invalid ad_type. Must be one of: ${validAdTypes.join(", ")}`
          );
        }
      }

      // Validate custom_content (if provided)
      let parsedCustomContent = {};
      if (custom_content) {
        if (typeof custom_content !== "object" || Array.isArray(custom_content)) {
          return errorResponse(
            res,
            400,
            "custom_content must be a valid object"
          );
        }
        parsedCustomContent = custom_content;
      }

      let custom_file_id = null;

      // Handle file upload
      if (req.file) {
        const uploadResponse = await imageKit.upload({
          file: req.file.buffer,
          fileName: `${Date.now()}_${req.file.originalname}`,
          folder: "/ad_units",
          tags: ["ad", ad_type || "unknown"],
        });

        custom_file_id = uploadResponse.fileId;

        if (ad_type === "banner") {
          const optimizedUrl = imageKit.url({
            src: uploadResponse.url,
            transformation: [
              {
                height: dimensions?.height || "300",
                width: dimensions?.width || "300",
                quality: "80",
                format: "webp",
              },
            ],
          });
          parsedCustomContent.image_url = optimizedUrl;
        } else if (ad_type === "video") {
          parsedCustomContent.youtube_url = uploadResponse.url;
        }
      } else {
        // Validate URLs if provided
        if (
          parsedCustomContent.image_url &&
          !isValidUrl(parsedCustomContent.image_url)
        ) {
          return errorResponse(res, 400, "Invalid image_url in custom_content");
        }
        if (
          parsedCustomContent.youtube_url &&
          !isValidUrl(parsedCustomContent.youtube_url)
        ) {
          return errorResponse(
            res,
            400,
            "Invalid youtube_url in custom_content"
          );
        }
      }

      // Parse stringified fields
      const parsedDimensions = dimensions
        ? typeof dimensions === "string"
          ? JSON.parse(dimensions)
          : dimensions
        : null;
      const parsedTargetPages = target_pages
        ? typeof target_pages === "string"
          ? JSON.parse(target_pages)
          : target_pages
        : null;
      const parsedTargetAudience = target_audience
        ? typeof target_audience === "string"
          ? JSON.parse(target_audience)
          : target_audience
        : null;
      const parsedSchedule = schedule
        ? typeof schedule === "string"
          ? JSON.parse(schedule)
          : schedule
        : null;

      const updateData = {
        name,
        code: code || `AD-${Date.now()}`,
        ad_type,
        placement,
        custom_content: parsedCustomContent,
        custom_file_id,
        dimensions: parsedDimensions,
        is_active: is_active === "true" || is_active === true,
        target_pages: parsedTargetPages,
        target_audience: parsedTargetAudience,
        schedule: parsedSchedule,
        priority: priority ? parseInt(priority) : 0,
        status: status || "paused",
      };

      const updatedAdUnit = await AdUnit.updateAdUnit(id, updateData);
      if (!updatedAdUnit) {
        return errorResponse(res, 404, "Ad unit not found");
      }

      return successResponse(
        res,
        200,
        "Ad unit updated successfully",
        updatedAdUnit
      );
    });
  } catch (error) {
    if (error.code === '23514') { // PostgreSQL check constraint violation
      return errorResponse(res, 400, `Invalid status value: ${error.detail}`);
    }
    return errorResponse(res, 500, error.message);
  }
};

const getAdUnits = async (req, res) => {
  try {
    const { activeOnly, status } = req.query;
    const allAdUnits = await AdUnit.getAllAdUnits({
      activeOnly: activeOnly === "true",
      status,
    });
    return successResponse(
      res,
      200,
      "Ad units retrieved successfully",
      allAdUnits
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const getAdUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const adUnit = await AdUnit.getAdUnitById(id);
    if (!adUnit) {
      return errorResponse(res, 404, "Ad unit not found");
    }
    return successResponse(res, 200, "Ad unit retrieved successfully", adUnit);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const deleteAdUnit = async (req, res) => {
  try {
    const { id } = req.params;

    const adUnit = await AdUnit.getAdUnitById(id);
    if (!adUnit) {
      return errorResponse(res, 404, "Ad unit not found");
    }

    const { custom_file_id } = adUnit;

    if (custom_file_id) {
      try {
        await imageKit.deleteFile(custom_file_id);
        console.log(`Deleted ImageKit file: ${custom_file_id} for ad unit ${id}`);
      } catch (imageKitError) {
        console.error(
          `Failed to delete ImageKit file for ad unit ${id}:`,
          imageKitError.message
        );
      }
    }

    const deleted = await AdUnit.deleteAdUnit(id);
    if (!deleted) {
      return errorResponse(res, 404, "Ad unit not found");
    }

    return successResponse(
      res,
      200,
      "Ad unit and associated file deleted successfully"
    );
  } catch (error) {
    console.error(`Error deleting ad unit ${req.params.id}:`, error.message);
    return errorResponse(res, 500, error.message);
  }
};

const getAdSettings = async (req, res) => {
  try {
    const adSettings = await AdSettings.getAdSettings();
    if (!adSettings) {
      return errorResponse(res, 404, "Ad settings not found");
    }
    return successResponse(
      res,
      200,
      "Ad settings retrieved successfully",
      adSettings
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const upsertAdSettings = async (req, res) => {
  try {
    const {
      publisher_id,
      ad_client,
      placements,
      ad_density,
      ad_format,
      target_pages,
    } = req.body;

    // Validate required fields
    if (!publisher_id || !ad_client) {
      return errorResponse(res, 400, "publisher_id and ad_client are required");
    }

    // Validate ad_density
    const validDensities = ["low", "balanced", "high"];
    if (!ad_density || !validDensities.includes(ad_density.toLowerCase())) {
      return errorResponse(
        res,
        400,
        `ad_density must be one of: ${validDensities.join(", ")}`
      );
    }

    // Validate ad_format
    const validFormats = ["responsive", "banner", "native"];
    if (!ad_format || !validFormats.includes(ad_format.toLowerCase())) {
      return errorResponse(
        res,
        400,
        `ad_format must be one of: ${validFormats.join(", ")}`
      );
    }

    // Validate target_pages
    const validTargetPages = ["all", "posts", "home", "custom"];
    let dbTargetPages = null;
    if (target_pages) {
      if (typeof target_pages !== "string") {
        return errorResponse(res, 400, "target_pages must be a string");
      }
      if (!validTargetPages.includes(target_pages.toLowerCase())) {
        return errorResponse(
          res,
          400,
          `target_pages must be one of: ${validTargetPages.join(", ")}`
        );
      }
      dbTargetPages = target_pages.toLowerCase();
    }

    // Validate and prepare placements
    let dbPlacements = null;
    if (placements) {
      let parsedPlacements;
      if (typeof placements === "string") {
        try {
          parsedPlacements = JSON.parse(placements);
        } catch {
          return errorResponse(res, 400, "placements must be a valid JSON array");
        }
      } else {
        parsedPlacements = placements;
      }

      if (!Array.isArray(parsedPlacements)) {
        return errorResponse(res, 400, "placements must be an array");
      }

      const validPlacements = [
        "header",
        "sidebar",
        "in_content",
        "footer",
        "custom",
      ];
      const invalidPlacements = parsedPlacements.filter(
        (p) => !validPlacements.includes(p.toLowerCase())
      );
      if (invalidPlacements.length > 0) {
        return errorResponse(
          res,
          400,
          `Invalid placements: ${invalidPlacements.join(
            ", "
          )}. Must be one of: ${validPlacements.join(", ")}`
        );
      }
      dbPlacements = parsedPlacements.map((p) => p.toLowerCase());
    }

    // Prepare data for database
    const adSettingsData = {
      publisher_id,
      ad_client,
      placements: dbPlacements,
      ad_density: ad_density.toLowerCase(),
      ad_format: ad_format.toLowerCase(),
      target_pages: dbTargetPages,
    };

    // Upsert ad settings
    const updatedAdSettings = await AdSettings.upsertAdSettings(adSettingsData);
    return successResponse(
      res,
      200,
      "Ad settings updated successfully",
      updatedAdSettings
    );
  } catch (error) {
    console.error("Error in upsertAdSettings:", error.message);
    return errorResponse(res, 500, error.message);
  }
};

// Utility function to validate URLs
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

module.exports = {
  createAdUnit,
  updateAdUnit,
  getAdUnits,
  getAdUnit,
  deleteAdUnit,
  getAdSettings,
  upsertAdSettings,
};