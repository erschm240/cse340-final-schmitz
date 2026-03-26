import { Router } from "express";
import { body, validationResult } from "express-validator";
import { createContactForm, getAllContactForms } from "../../models/forms/contact.js";
// Need contact validation added to forms validation middleware

const router = Router();

/**
 * Display the contact form page
 */
const contactFormPage = (req, res) => {
    res.render('forms/contact/form', {
        title: 'Contact a Site Member'
    });
};

/**
 * Handle contact form submission with validation
 * Pass: save to db and redirect
 * Fail: log errors and redirect
 */
const handleContactSubmission = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect('/contact');
    }
    
    // Extract validated data
    const { recipient, subject, message } = req.body;

    try {
        // Save to database
        await createContactForm(recipient, subject, message);
        req.flash('success', 'Thanks for contacting us! You can look forward to our response soon.');
        res.redirect('/contact/responses');
    } catch (error) {
        console.error('Error saving contact form: ', error);
        req.flash('error', 'Unable to submit your message. Please try again later.');
        res.redirect('/contact');
    }
};

/**
 * Display all contact form submissions
 */
const displayContactResponses = async (req, res) => {
    let contactForms = [];

    try {
        contactForms = await getAllContactForms();
    } catch (error) {
        console.error('Error retrieving contact forms: ', error);
    }

    res.render('forms/contact/responses', {
        title: 'Contact Form Submissions',
        contactForms
    });
};

/**
 * GET /contact - Display the contact form
 */
router.get('/', contactFormPage);

/**
 * POST /contact - Handle contact form submission with validation
 */
router.post('/',
    [
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
    ],
    handleContactSubmission
);

/**
 * GET /contact/responses - Display all contact form submissions
 */
router.get('/responses', displayContactResponses);

export default router;