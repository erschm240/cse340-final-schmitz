import { validationResult } from 'express-validator';
import { findUserByEmail, verifyPassword } from '../../models/forms/login.js';
import { Router } from 'express';
import { loginValidation } from '../../middleware/validation/forms.js';

const router = Router();

/**
 * Display the login form page
 */
const displayLoginForm = (req, res) => {
    res.render('forms/login/form', {
        title: 'User Login'
    });
};

/**
 * Process login form submission
 */
const processLogin = async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect('/login');
    }

    // Extract email and password from req.body
    const { email, password } = req.body;
    try {
        const user = await findUserByEmail(email);

        if (!user) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }

        const verifyPwd = await verifyPassword(password, user.passwordHash);
        if (!verifyPwd) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }

        // Remove password from user object before storing in session
        delete user.password;

        req.session.user = user;

        req.flash('success', `Welcome, ${user.name}!`);
        res.redirect('/dashboard');

    } catch (error) {
        console.error('Error during login: ', error);
        req.flash('error', 'Unable to log in. Please try again later.');
        return res.redirect('/login');
    }
};

/**
 * Handle user logout
 */
const processLogout = (req, res) => {
    // check if there is a session object on the request
    if (!req.session) {
        return res.redirect('/');
    }

    // Remove the session from the store
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session: ', err);

            /**
             * Clear the session cookie from the browser
             */
            res.clearCookie('connect.sid');

            /**
             * Send a 500 error
             */
            res.status(500).send('Error logging out');
        }

        // If session destruction succeeded, clear the session cookie from the browser
        res.clearCookie('connect.sid');

        // Redirect user to the homepage
        res.redirect('/');
    });
};

/**
 * Display protected dashboard
 */
const displayDashboard = (req, res) => {
    const user = req.session.user;
    const sessionData = req.session;

    // Ensure user and sessionData do not contain password field
    if (user && user.password) {
        console.error('Security error: password found in user object');
        delete user.password;
    }
    if (sessionData.user && sessionData.user.password) {
        console.error('Security error: password found in sessionData.user');
        delete sessionData.user.password;
    }

    res.render('dashboard', {
        title: 'Dashboard',
        user,
        sessionData
    });
};

// Routes
router.get('/', displayLoginForm);
router.post('/', loginValidation, processLogin);

// Export router as default, and specific functions for root-level routes
export default router;
export { processLogout, displayDashboard };