const jwt = require("jsonwebtoken");
const  User  = require("../models/User.model");


class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

const Authorization = (requiredRoles ) => {
  return async (req, res, next) => {
    try {
      // Get token from cookies
      const token = req.cookies.accessToken;
      const refreshToken = req.cookies.refreshToken;

      console.log('Access Token:', token);
      console.log('Refresh Token:', refreshToken);
      console.log('Request body:', req.body);

      if (!token) {
        // If no access token but refresh token exists, try to refresh
        if (refreshToken) {
          try {
            const decoded = jwt.verify(
              refreshToken,
              process.env.REFRESH_TOKEN_SECRET
            );
            
            // Find user
            const user = await User.findByPk(decoded.id);
            console.log('Found user:', user);
            if (!user) {
              return next(new ErrorHandler(401, "User not found or inactive"));
            }

            req.user = {
              id: user.id,
              email: user.email,
              role: user.role
            };

            // Check role
            if (requiredRoles.includes(user.role)) {
              // Generate new access token
              const newToken = user.generateJWT();
              
              // Set new token as cookie
              res.cookie('accessToken', newToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', 
                sameSite: 'strict',
                maxAge: 60 * 60 * 1000 // 1 hour
              });
              
              return next();
            } else {
              return next(new ErrorHandler(403, "Insufficient permissions"));
            }
          } catch (error) {
            // Clear invalid cookies
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            return next(new ErrorHandler(401, "Invalid refresh token"));
          }
        }
        return next(new ErrorHandler(401, "Not authenticated - please log in"));
      }

      // Verify token
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user
        const user = await User.findByPk(decoded.id);
        if (!user) {
          res.clearCookie('accessToken');
          return next(new ErrorHandler(401, "User not found or inactive"));
        }

        req.user = {
          id: user.id,
          email: user.email,
          role: user.role
        };

        // Check role authorization
        if (requiredRoles.includes(user.role)) {
          return next();
        } else {
          return next(new ErrorHandler(403, "Insufficient permissions"));
        }
      } catch (error) {
        // Handle expired token
        if (error.name === 'TokenExpiredError' && refreshToken) {
          // Clear expired access token
          res.clearCookie('accessToken');
          // Try refresh token flow (recursive call)
          return Authorization(requiredRoles)(req, res, next);
        }
        
        // Clear invalid cookies
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return next(new ErrorHandler(401, "Invalid or expired token"));
      }
    } catch (error) {
      console.error("Auth middleware error:", error);
      return next(new ErrorHandler(500, "Authentication error"));
    }
  };
};

module.exports = Authorization;