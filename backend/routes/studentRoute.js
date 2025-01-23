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

router.get('/view-all-enrollments', studentController.getAllEnrollmentRequests);


module.exports = router;
