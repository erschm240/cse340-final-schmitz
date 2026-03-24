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

export { requireLogin };