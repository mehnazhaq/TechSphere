export const adminOnly = (req, res, next) => {
  if (req.userRole !== 'Admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
      statusCode: 403,
    });
  }
  next();
};

export const clientOnly = (req, res, next) => {
  if (req.userRole !== 'Client') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Client privileges required.',
      statusCode: 403,
    });
  }
  next();
};

export const requireAuth = (req, res, next) => {
  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
      statusCode: 401,
    });
  }
  next();
};
