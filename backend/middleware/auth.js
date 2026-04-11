const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ─── Protect: Verify JWT token ────────────────────────────────────────────────
exports.protect = async (req, res, next) => {
  let token;

  // Check Authorization header: Bearer <token>
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Also accept token in cookie
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route. Please log in.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User belonging to this token no longer exists.'
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Token is invalid or has expired. Please log in again.'
    });
  }
};

// ─── Authorize: Role-based access control ────────────────────────────────────
// Usage: authorize('Admin') or authorize('Admin', 'Technician')
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Role '${req.user.role}' is not authorized for this action.`
      });
    }
    next();
  };
};
