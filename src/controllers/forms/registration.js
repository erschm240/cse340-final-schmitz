import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { emailExists, saveUser, getAllUsers } from '../../models/forms/registration.js';

const router = Router();

/**
 * Validation rules for user registration
 */
const registrationValidation = [
    body('name')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters'),
    body('username')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters'),
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Must be a valid email address'),
    body('emailConfirm')
        .trim()
        .custom((value, { req }) => value === req.body.email)
        .withMessage('Email addresses must match'),
    body('password')
        .isLength({ min: 8 })
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number')
        .matches(/[!@#$%^&*]/)
        .withMessage('Password must contain at least one special character'),
    body('passwordConfirm')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords must match')
];

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
        console.error('Validation errors: ', errors.array());
        return res.redirect('/register');
    }

    // Extract validated data
    const { name, username, email, password } = req.body;

    try {
        // Check if email already exists in the database
        const checkEmail = await emailExists(email);

        if(checkEmail) {
            console.log('Email already submitted');
            return res.redirect('/register');
        }

        // Hash the password before saving to database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to database with hashed password
        await saveUser(name, username, email, hashedPassword);

        console.log('Registration successful');
        return res.redirect('/register/list');

    } catch (error) {
        console.error('Error during registration: ', error);
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
        users
    });
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
router.get('/list', displayAllUsers);

export default router;