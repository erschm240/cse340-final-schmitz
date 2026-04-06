import { Router } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { requireLogin, requireRole } from '../../middleware/auth.js';
import { registrationValidation, editAccountValidation } from '../../middleware/validation/forms.js';
import {
    emailExists,
    saveUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} from '../../models/forms/registration.js';

const router = Router();

/**
 * Display registration form page
 */
const displayRegistrationForm = (req, res) => {
    res.render('forms/registration/form', {
        title: 'Create an Account'
    });
};

/**
 * Handle user registration with validation and password hashing
 */
const processRegistration = async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect('/register');
    }

    // Extract validated data
    const { name, username, email, password } = req.body;

    try {
        // Check if email already exists in the database
        const checkEmail = await emailExists(email);

        if(checkEmail) {
            req.flash('warning', 'Sorry, an account with this email already exists.');
            return res.redirect('/register');
        }

        // Hash the password before saving to database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to database with hashed password
        await saveUser(name, username, email, hashedPassword);

        req.flash('success', 'Account creation successful! Feel free to login at any time.');
        return res.redirect('/login');

    } catch (error) {
        console.error('Error during registration: ', error);
        req.flash('error', 'Unable to complete your registration. Please try again later.');
        return res.redirect('/register');
    }
};

/**
 * Display all registered users
 */
const displayAllUsers = async (req, res) => {
    let users = [];

    try {
        // Retrieve all users
        users = await getAllUsers();

    } catch (error) {
        console.error('Error retrieving users: ', error);
    }

    res.render('forms/registration/list', {
        title: 'Registered Users',
        users,
        user: req.session && req.session.user ? req.session.user : null
    });
};

/**
 * Display the edit account form
 * Users and instructors can edit their own account, admins can edit any account
 */
const displayEditAccountForm = async (req, res) => {
    const targetUserId = parseInt(req.params.id);
    const currentUser = req.session.user;

    const targetUser = await getUserById(targetUserId);

    if (!targetUser) {
        req.flash('error', 'User not found');
        return res.redirect('/register/list');
    }

    // Check permissions
    const canEdit = currentUser.userId === targetUserId || currentUser.roleName === 'admin';

    if (!canEdit) {
        req.flash('error', 'You do not have permission to edit this account');
        return res.redirect('/register/list');
    }

    res.render('forms/registration/edit', {
        title: 'Edit Account',
        user: targetUser
    });
};

/**
 * Process edit account form submission
 */
const processEditAccount = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/register/${req.params.id}/edit`);
    }

    const targetUserId = parseInt(req.params.id);
    const currentUser = req.session.user;
    const { name, username, email } = req.body;

    try {
        const targetUser = await getUserById(targetUserId);

        if (!targetUser) {
            req.flash('error', ' User not found');
            return res.redirect('/register/list');
        }

        // Check permissions
        const canEdit = currentUser.userId === targetUserId || currentUser.roleName === 'admin';

        if (!canEdit) {
            req.flash('error', 'You do not have permission to edit this account.');
            return res.redirect('/register/list');
        };

        // Check if new email already exists (belongs to different user)
        const emailTaken = await emailExists(email);
        if(emailTaken && targetUser.email != email) {
            req.flash('error', 'An account with this email already exists');
            return res.redirect(`/register/${targetUserId}/edit`);
        }

        // Update the user
        await updateUser (targetUserId, name, username, email);

        // If user edited their own account, update session
        if (currentUser.id === targetUserId) {
            req.session.user.name = name;
            req.session.user.username = username;
            req.session.user.email = email;
        }

        req.flash('success', 'Account updated successfully');
        res.redirect('/register/list');
    } catch (error) {
        console.error('Error updating account: ', error);
        req.flash('error', 'An error occurred while updating the account');
        res.redirect(`/register/${targetUserId}/edit`);
    }
};

/**
 * Process account deletion
 * Only admins can delete accounts, and they cannot delete themselves
 */
const processDeleteAccount = async (req, res) => {
    const targetUserId = parseInt(req.params.id);
    const currentUser = req.session.user;

    // Only admins can delete accounts
    if (currentUser.roleName !== 'admin') {
        req.flash('error', 'You do not have permission to delete accounts');
        return res.redirect('/register/list');
    }

    // Prevent admins from deleting their own account
    if (currentUser.userId === targetUserId) {
        req.flash('error', 'You cannot delete your own account');
        return res.redirect('/register/list');
    }

    try {
        const deleted = await deleteUser(targetUserId);

        if (deleted) {
            req.flash('success', ' User account deleted successfully');
        } else {
            req.flash('error', 'User not found or already deleted');
        }
    } catch (error) {
        console.error('Error deleting user: ', error);
        req.flash('error', 'An error occurred while deleting the account');
    }

    return res.redirect('/register/list');
};

/**
 * GET /registration - Display the registration form
 */
router.get('/', displayRegistrationForm);

/**
 * POST /registration - Handle registration form submission with validation
 */
router.post('/', registrationValidation, processRegistration);

/**
 * GET /registration/list - Display all registered users
 */
router.get('/list', requireLogin, requireRole(['admin']), displayAllUsers);

/**
 * GET register/:id/edit - Display the edit account form
 */
router.get('/:id/edit', requireLogin, displayEditAccountForm);

/**
 * POST /register/:id/edit - Process account edit
 */
router.post('/:id/edit', requireLogin, editAccountValidation, processEditAccount);

/**
 * POST /register/:id/delete - Delete user account
 */
router.post('/:id/delete', requireLogin, processDeleteAccount);

export default router;