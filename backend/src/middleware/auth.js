/**
 * Authentication Middleware
 */

const jwt = require('jsonwebtoken');

/**
 * Verify API key from ESP32
 */
exports.verifyApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.body.api_key;
  
  if (!apiKey) {
    return res.status(401).json({
      error: 'API key is required'
    });
  }
  
  if (apiKey !== process.env.API_KEY) {
    return res.status(403).json({
      error: 'Invalid API key'
    });
  }
  
  next();
};

/**
 * Verify JWT token for dashboard users
 */
exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      error: 'Access token is required'
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      error: 'Invalid or expired token'
    });
  }
};

/**
 * Optional authentication - adds user if token is valid
 */
exports.optionalAuth = (req, res, next) => {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      // Token invalid, continue without user
    }
  }
  
  next();
};
