const express = require('express');
const router = express.Router();
const deptrepController = require('../controllers/deptrepController');

router.get('/login', deptrepController.loginRepPage);
router.post('/login', deptrepController.handleRepLogin);
router.get('/session', deptrepController.getSessionUser);
router.post('/logout', deptrepController.logout);

// manage student get/post/remove
router.get('/get-students', deptrepController.getStudents);
router.post('/manage-student', deptrepController.postAddStudent);
router.post('/remove-student/:id', deptrepController.removeStudent);
router.get('/:departmentId/classes', deptrepController.getClassesByDepartment);

router.get("/events", deptrepController.getAllEvents);

// Route to register event
router.post("/register", deptrepController.registerEvent);

// Route to fetch students by department
router.get("/get-students-reg", deptrepController.getAllStudents);

//view department wise-rankings
router.get('/view-department-rankings', deptrepController.getDepartmentRankings);

//view announcement
router.get('/view-announcements', deptrepController.getViewAnnouncements);

//view scoreboard
router.get('/view-scoreboard', deptrepController.getViewScoreboard);

// View complaints
router.get('/view-complaints', deptrepController.viewComplaints);

// Reply to a complaint
router.post('/reply-to-complaint', deptrepController.replyToComplaint);


router.get('/manage-profile', deptrepController.manageProfile);



module.exports = router;
