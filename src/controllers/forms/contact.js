import { Router } from "express";
import { validationResult } from "express-validator";
import { createContactForm, getAllContactForms, getAllPossibleRecipients } from "../../models/forms/contact.js";
import { contactValidation } from "../../middleware/validation/forms.js";

const router = Router();

/**
 * Display the contact form page
 */
const contactFormPage = async (req, res) => {
    const recipients = await getAllPossibleRecipients();
    const messageTypes = ['Mistake in Tutorial', 'New Tutorial Suggestion', 'Tutorial Question', 'Error on Site', 'Site Question'];

    res.render('forms/contact/form', {
        title: 'Contact a Site Member',
        recipients: recipients,
        messageTypes: messageTypes
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
    const { recipient, 'message-type': messageType, subject, message } = req.body;
    console.log(req.body);

    const sentBy = req.session.user;


    try {
        // Save to database
        await createContactForm(recipient, messageType, subject, message, sentBy);
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
router.post('/', contactValidation, handleContactSubmission);

/**
 * GET /contact/responses - Display all contact form submissions
 */
router.get('/responses', displayContactResponses);

export default router;