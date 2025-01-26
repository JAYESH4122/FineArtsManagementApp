const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Show Student Login Page
// Handle Student Login
router.post('/login', studentController.handleStudentLogin);

// Student Dashboard
router.get('/dashboard', studentController.dashboard);

// Logout Route
router.post('/logout', studentController.logout);

//Student enrollment
router.get('/get-events', studentController.getEvents);
router.get('/get-classes', studentController.getClasses);
router.post('/request-enrollment', studentController.requestEnrollment);
router.get('/enrollment-requests', studentController.getEnrollmentRequests);
router.get('/session-user', studentController.getSessionUserData);

// Student Routes
router.get('/complaints', studentController.getStudentComplaints);
router.post('/complaints', studentController.addComplaint);


// Route to get student data for feedback form
router.get('/feedback/form-data', studentController.getFeedbackFormData);

// API to submit feedback
router.post('/feedback', studentController.submitFeedback);

//view registrations
router.get('/view-all-enrollments', studentController.getAllEnrollmentRequests);

// Route to get student profile
router.get('/profile', studentController.getStudentProfile);

// Route to update student profile
router.put('/profile', studentController.updateStudentProfile);

module.exports = router;