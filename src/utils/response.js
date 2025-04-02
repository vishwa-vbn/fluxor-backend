function successResponse(res, statusCode, message, data = null) {
    res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }
  
  function errorResponse(res, error, statusCode = 500) {
    res.status(statusCode).json({
      success: false,
      message: error.message || 'An error occurred',
    });
  }
  
  module.exports = { successResponse, errorResponse };