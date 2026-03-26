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

    // Override res.redirect to save session before redirecting
    const originalRedirect = res.redirect.bind(res);
    res.redirect = (...args) => {
        if (sessionNeedsSave && req.session) {
            req.session.save(() => {
                originalRedirect.apply(res, args);
            });
        } else {
            originalRedirect.apply(res, args);
        }
    };

    /**
     * The flash functoin handles bothsetting and getting messages
     * - Called with 2 arguments (type, message): stores a new message
     * - Called with 1 argument (type): retrieves and clears messages of that type
     * - Called with 0 arguments (): retrieves and clears all messages
     */
    req.flash = function(type, message) {
        // If session doesn't exist, return early to prevent errors
        if (!req.session) {
            // If setting a message, it can't be done without a session
            if (type && message) {
                return; // Silently fail
            }
            // If getting messages, return empty structure
            return { success: [], error: [], warning: [], info: [] };
        }

        // Initialize flahs storage if it doesn't exist
        if (!req.session.flash) {
            req.session.flash = {
                success: [],
                error: [],
                warning: [],
                info: []
            };
        }

        // Setting a flash message
        if (type && message) {
            // Check if this message type's array exists
            if (!req.session.flash[type]) {
                req.session.flash[type] = [];
            }
            // Addthe message to the appropriate type array
            req.session.flash[type].push(message);
            // Mark that session needs to be saved before redirect
            sessionNeedsSave = true;
            return;
        }

        // Getting one message type
        if (type && !message) {
            const messages = req.session.flash[type] || [];
            // Clear this type's messages after retrieving
            req.session.flash[type] = [];
            return messages;
        }

        // Getting all messages
        const allMessages = req.session.flash || {
            success: [],
            error: [],
            warning: [],
            info: []
        };

        // Clear all messages after retrieving
        req.session.flash = {
            success: [],
            error: [],
            warning: [],
            info: []
        };

        return allMessages;
    };

    next();
};

/**
 * Make flash function available to all templates via res.locals
 */
const flashLocals = (req, res, next) => {
    res.locals.flash = req.flash;
    next();
};

/**
 * Combined flash middleware that runs both functions in the correct order
 */
const flash = (req, res, next) => {
    flashMiddleware(req, res, () => {
        flashLocals(req, res, next);
    });
};

export default flash;