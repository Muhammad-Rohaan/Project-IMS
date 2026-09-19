import jwt from 'jsonwebtoken';
import UserModel from '../models/User.model.js';

/**
 * Protect routes by verifying JWT token from the HTTP-only Cookie.
 * This middleware should be used on routes that require a user to be logged in.
 */
export const protect = async (req, res, next) => {
    let token;

    // --- YAHAN PEHLE CHANGES KIYE JAYENGE ---

    // 1. Token ko HTTP-only Cookie se nikalna (Iske liye app.js mein 'cookie-parser' zaroori hai!)
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    // 2. Fallback (Optional): Agar Bearer token bheja jaye
    // Check if the token is present in the headers
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

        // Extract token from 'Bearer <token>'
        token = req.headers.authorization.split(' ')[1];
    }

    // CHANGES END

    // If no token is found in cookie or header
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by ID from the token payload and attach it to the request
        // Exclude the password field
        req.user = await UserModel.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
}

/**
 * Authorize user based on roles.
 * This is a higher-order function that takes roles as arguments.
 * Example usage: router.get('/admin-only', protect, authorize('admin'), adminController);
 */
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `User role '${req.user.role}' is not authorized to access this route` });
        }
        next();
    };
};