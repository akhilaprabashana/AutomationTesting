const roleAuth = (roles) => {
    return (req, res, next) => {
        // User is already authenticated via auth middleware
        // Check if user role is in the allowed roles
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // If roles is not an array, convert it to one
        const allowedRoles = Array.isArray(roles) ? roles : [roles];

        // If 'any' is specified, allow any authenticated user
        if (allowedRoles.includes('any') || allowedRoles.length === 0) {
            return next();
        }

        // Check if user's role is in the allowed roles
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'Access denied: Insufficient permissions'
            });
        }

        next();
    };
};

module.exports = roleAuth; 