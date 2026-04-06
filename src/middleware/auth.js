/**
 * Middleware to require authentication for protected routes
 */
const requireLogin = (req, res, next) => {
    // Check if user is logged in via session
    if (req.session && req.session.user) {
        // If authenticated
        res.locals.isLoggedIn = true;
        next();
    } else {
        // If not authenticated
        res.redirect('/login');
    }
};

/**
 * Middleware to require specific roles for route access
 * Returns middleware that checks if the user has the required role
 * 
 * @param {array} roleName - The role name(s) required
 * @returns {Function} Express middleware function
 */
const requireRole = (roleName) => {
    return (req, res, next) => {
        // Check if user is logged in first
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page');
            return res.redirect('/login');
        }

        // Check if user's role matches the required role
        if (!roleName.includes(req.session.user.roleName)) {
            req.flash('error', 'You do not have permission to access this page');
            return res.redirect('/');
        }

        // User has required role, continue
        next();
    };
};

export { requireLogin, requireRole };