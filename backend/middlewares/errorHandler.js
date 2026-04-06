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

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = 'ID không hợp lệ';
  }

  // Business logic errors with explicit statusCode
  if (err.statusCode) {
    statusCode = err.statusCode;
  }

  // Zod Validation Error (v4 uses .issues, v3 used .errors)
  if (err.name === 'ZodError') {
    statusCode = 400;
    const zodIssues = err.issues || err.errors || [];
    message = zodIssues.map(e => e.message).join(', ');
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
