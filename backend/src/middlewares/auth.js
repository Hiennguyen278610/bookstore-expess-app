// Auth Middleware - TODO: Verify JWT token
export const auth = (req, res, next) => {
    // Verify token and attach user to req
    next();
};
