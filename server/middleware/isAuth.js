// Import required dependencies
import jwt from "jsonwebtoken";
import { User } from "../model/user.js";

/**
 * Authentication middleware to protect routes
 * Verifies JWT token from request headers and attaches user to request object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object 
 * @param {Function} next - Express next middleware function
 */
export const isAuth = async (req, res, next) => {
  try {
    // Extract token from request headers
    const { token } = req.headers;

    // Return error if no token provided
    if (!token)
      return res.status(403).json({
        message: "Please login",
      });

    // Verify and decode JWT token
    const decodedData = jwt.verify(token, process.env.JWT_SEC);

    // Find user by ID from token and attach to request
    req.user = await User.findById(decodedData._id);

    // Continue to next middleware/route handler
    next();
  } catch (error) {
    // Return error if token invalid or expired
    res.status(500).json({
      message: "Please login", 
    });
  }
};
