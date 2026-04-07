import { body } from 'express-validator';
import { getAllPossibleRecipients } from '../../models/forms/contact.js';

/**
 * Validation rules for contact form
 */

const contactValidation = [
    body('recipient')
        .trim()
        .custom(async (value) => {
            const recipients = await getAllPossibleRecipients();
            const checkIfExists = recipients.some((recipient) => recipient.name === value);
            if (!checkIfExists) {
                throw new Error('Must be a valid recipient from the list');
            }
            return true;
        }),
    body('message-type')
        .trim()
        .custom((value) => {
            const messageTypes = ['Mistake in Tutorial', 'New Tutorial Suggestion', 'Tutorial Question', 'Error on Site', 'Site Question'];
            const checkIfExists = messageTypes.includes(value);
            if (!checkIfExists) {
                throw new Error('Must be a valid message type from the list');
            }
            return true;
            }),
    body('subject')
        .trim()
        .isLength({ min: 2, max: 255 })
        .withMessage('Subject must be between 2 and 255 characters')
        .matches(/^[a-zA-Z0-9\s\-.,!?]+$/)
        .withMessage('Subject contains invalid characters'),
    body('message')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Message must be between 10 and 2000 characters')
        .custom((value) => {
            // Check for spam patterns (excessive repetition)
            const words = value.split(/\s+/);
            const uniqueWords = new Set(words);
            if (words.length > 20 && uniqueWords.size / words.length < 0.3) {
                throw new Error('Message appears to be spam');
            }
            return true;
        })
];

/**
 * Validation rules for user registration
 */
const registrationValidation = [
    body('name')
        .trim()
        .isLength({min: 2, max: 100})
        .withMessage('Name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s'-]+$/)
        .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Must be a valid email address')
        .isLength({ max: 255 })
        .withMessage('Email address is too long'),
    body('emailConfirm')
        .trim()
        .custom((value, {req}) => value === req.body.email)
        .withMessage('Email addresses must match'),
    body('password')
        .isLength({min: 8, max: 128})
        .withMessage('Password must be between 8 and 128 characters')
        .matches(/[a-z]/)
        .withMessage('Password must contain at least one lowercase letter')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number')
        .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
        .withMessage('Password must contain at least one special character'),

    body('passwordConfirm')
        .custom((value, {req}) => value === req.body.password)
        .withMessage('Passwords must match')
];

/**
 * Validation rules for editing user accounts
 */
const editAccountValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s'-]+$/)
        .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Must be a valid email address')
        .isLength({ max: 255 })
        .withMessage('Email address is too long')
];

/**
 * Validation rules for login form
 */
const loginValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
        .isLength({max: 255})
        .withMessage('Email Address is too long'),

    body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({min: 8, max: 128})
    .withMessage('Password must be between 8 and 128 characters')
];

const commentValidation = [
    body('message')
        .trim()
        .isLength({ min: 2, max: 1000 })
        .withMessage('Message must be between 2 and 1000 characters')
        .matches(/^[a-zA-Z0-9\s\-.,!?]+$/)
        .withMessage('Message contains invalid characters')
        .custom((value) => {
            // Check for spam patterns (excessive repetition)
            const words = value.split(/\s+/);
            const uniqueWords = new Set(words);
            if (words.length > 20 && uniqueWords.size / words.length < 0.3) {
                throw new Error('Message appears to be spam');
            }
            return true;
        })
];

const messageStatusValidation = [
    body('status')
        .trim()
        .isLength({ min: 2, max: 10 })
        .withMessage('Message must be between 2 and 10 characters')
        .matches(/^[a-zA-Z0-9\s\-.,!?]+$/)
        .withMessage('Message contains invalid characters')
];

export {
    contactValidation,
    registrationValidation,
    editAccountValidation,
    loginValidation,
    commentValidation,
    messageStatusValidation
};