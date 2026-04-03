/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Handling Mongoose duplication validation
  if (err.name === 'MongoServerError' && err.code === 11000) {
    statusCode = 409;
    message = 'Email này đã được sử dụng';
  }

  // Zod Validation Error
  if (err.name === 'ZodError') {
    statusCode = 400;
    message = err.errors.map(e => e.message).join(', ');
  }

  // Token lỗi
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Phiên đăng nhập không hợp lệ';
  }

  // Chỉ trả stacktrace nếu ở non-prod mode
  res.status(statusCode).json({
    success: false,
    message: message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

module.exports = errorHandler;
