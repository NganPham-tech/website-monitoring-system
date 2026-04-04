const adminMiddleware = (req, res, next) => {
  // authMiddleware was already executed before this, so req.user exists
  if (!req.user || req.user.role !== 'admin') {
    // If not admin, return standard 403 Forbidden
    return res.status(403).json({ success: false, message: 'Forbidden. Admin access required.' });
  }
  next();
};

module.exports = adminMiddleware;
