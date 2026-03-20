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
 * Handle contact form subbmission with validation
 * Pass: save to db and redirect
 * Fail: log errors and redirect
 */
const handleContactSubmission = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.error('Validation errors: ', errors.array());
        return res.redirect('/contact');
    }

    // Extract validated data
    const { recipient, subject, message } = req.body;
    
    try {
        // Save to database
        await createContactForm(recipient, subject, message);
        console.log('Contact form submitted successfully');
        res.redirect('/contact/responses');
    } catch (error) {
        console.error('Error saving contact form: ', error);
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
        body('recipient')
            .trim()
            .isLength({ min: 2 })
            . withMessage('Subject must be at least 2 characters'),
        body('subject')
            .trim()
            .isLength({ min: 2 })
            .withMessage('Subject must be at least 2 characters'),
        body('message')
            .trim()
            .isLength({ min: 10 })
            .withMessage('Message must be at least 10 characters')
    ],
    handleContactSubmission
);

/**
 * GET /contact/responses - Display all contact form submissions
 */
router.get('/responses', displayContactResponses);

export default router;