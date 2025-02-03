
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// admin login
// Admin Login Route
router.post('/login', adminController.adminLogin);

// Get Session User Route
router.get('/session', adminController.getSessionUser);

// Admin Logout Route
router.post('/logout', adminController.adminLogout);

//add announcement
router.post('/add-announcement', adminController.postAnnouncement);

//view announcement
router.get('/view-announcements', adminController.getViewAnnouncements);

//add scoreboard
// Route to get departments and their associated classes
router.get('/get-departments', adminController.getDepartmentsAndClasses);

// Route to get events and categories
router.get('/get-events', adminController.getEventsAndCategories);

// Route to get all students for autocomplete
router.get('/get-students', adminController.getStudents);

// Route to add a scoreboard entry
router.post('/add-scoreboard', adminController.addScoreboard);

//view scoreboard
router.get('/view-scoreboard', adminController.getViewScoreboard);

//manage rep get/post/remove
router.get('/manage-rep', adminController.getAddRepForm);
router.post('/manage-rep', adminController.postAddRep);
router.post('/remove-rep/:id', adminController.removeRep);

//manage student get/post/remove
router.get('/get-department', adminController.getDepartments);
router.get('/get-students', adminController.getStudents);
router.post('/manage-student', adminController.postAddStudent);
router.post('/remove-student/:id', adminController.removeStudent);
router.get('/get-classes/:departmentId', adminController.getClassesByDepartment);


//add event
router.get('/add-event', adminController.getAddEventForm);
router.post('/add-event', adminController.postAddEvent);

//view department wise-rankings
router.get('/view-department-rankings', adminController.getDepartmentRankings);

//view feedback
router.get('/feedback', adminController.viewFeedback);

// View registrations
router.get('/view-registrations', adminController.viewRegistrations);

module.exports = router;
