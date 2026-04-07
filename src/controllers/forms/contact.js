import { Router } from "express";
import { validationResult } from "express-validator";
import { createContactForm, deleteContactMessage, getAllContactForms, getAllPossibleRecipients, getContactFormById, updateStatus } from "../../models/forms/contact.js";
import { contactValidation } from "../../middleware/validation/forms.js";
import { requireLogin, requireRole } from "../../middleware/auth.js";
import { messageStatusValidation } from "../../middleware/validation/forms.js";

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


    try {
        // Save to database
        const sentBy = req.session.user.name;
        await createContactForm(recipient, messageType, subject, message, sentBy);
        req.flash('success', 'Thanks for contacting us! You can look forward to our response soon.');
        res.redirect('/dashboard');
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

const displayChangeContactStatusForm = async (req, res) => {
    const messageId = req.params.id;
    const message = await getContactFormById(messageId);

    res.render(`forms/contact/change-status`, {
        title: 'Change Message Status',
        message
    });
};

const processChangeContactStatus = async (req, res) => {
    const errors = validationResult(req);
    const messageId = req.params.id;
    const userRole = req.session.user.roleName;

    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
    return res.redirect(`/contact/${messageId}/change-status`);
    }

    const status = req.body.status;

    try {
        const message = await getContactFormById(messageId);

        if (!message) {
            req.flash('error', 'Contact message not found');
            return res.redirect('/dashboard');
        }

        // Check permissions
        const canEdit = userRole === 'admin' || userRole === 'instructor';

        if (!canEdit) {
            req.flash('error', 'You do not have permission to change the status.');
            return res.redirect('/dashboard');
        };

        // Update status
        await updateStatus(messageId, status);

        req.flash('success', 'Message status updated successfully');
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error updating message status: ', error);
        req.flash('error', 'An error occurred while updating message status');
        res.redirect(`/contact/${messageId}/change-status`);
    }
};

const processDeleteContactMessage = async (req, res) => {
    const messageId = req.params.id;
    const userRole = req.session.user.roleName;

    if (userRole !== 'admin') {
        req.flash('error', 'You do not have permission to delete contact messages');
        return res.redirect('/dashboard');
    }

    try {
        const deleted = await deleteContactMessage(messageId);

        if (deleted) {
            req.flash('success', 'Message deleted successfully');
        } else {
            req.flash('error', 'Message not found or already deleted');
        }
    } catch (error) {
        console.error('Error deleting message: ', error);
        req.flash('error', 'An error occurred while deleting the message');
    }

    return res.redirect('/dashboard');
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
 * GET /responses - Display all contact form submissions
 */
router.get('/responses', requireLogin, requireRole(['admin']), displayContactResponses);

/**
 * Get /:id/change-status - Display change status form
 */
router.get('/:id/change-status', requireLogin, requireRole(['admin']), displayChangeContactStatusForm);

/**
 * POST /:id/change-status - Process change status
 */
router.post('/:id/change-status', requireLogin, requireRole(['admin', 'instructor']), messageStatusValidation, processChangeContactStatus);


/**
 * POST /:id/delete - Delete contact message
 */
router.post('/:id/delete', requireLogin, requireRole(['admin']), processDeleteContactMessage);

export default router;