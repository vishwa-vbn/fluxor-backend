const errorResponse = (res, statusCode, message) => {
  if (typeof statusCode !== 'number') {
    console.error(`Invalid statusCode: ${statusCode}. Using 500.`);
    statusCode = 500;
    message = message || 'Internal server error';
  }
  return res.status(statusCode).json({
    status: statusCode,
    message,
  });
};

const successResponse = (res, statusCode, message, data = null) => {
  const response = {
    status: statusCode,
    message,
  };
  if (data) {
    response.data = data;
  }
  return res.status(statusCode).json(response);
};

module.exports = { successResponse, errorResponse };