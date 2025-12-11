// Validation Middleware - TODO: Validate request data
export const validate = (schema) => {
    return (req, res, next) => {
        // Validate req.body against schema
        next();
    };
};
