/**
 * Flash message middleware
 * 
 * Types of flash message function calls:
 * req.flash('success', 'Message text') // Store a message
 * req.flash('error')                   // Get all error messages
 * req.flash()                          // Get all messages (all types)
 */

/**
 * Initialize flash mesage storage and provide access methods
 */
const flashMiddleware = (req, res, next) => {
    // Track whether flash messages were set
    let sessionNeedsSave = false
};

// Will finish flash messaging later, need to implement sessions first