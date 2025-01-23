const Department = require('../models/departmentmodel');
const Student = require('../models/studentmodel');
const Announcement = require('../models/announcementmodel');
const Scoreboard = require('../models/scoreboardmodel');
const Registration = require('../models/registrationmodel');
const DeptRep = require('../models/deprepmodel');
const Event = require('../models/eventmodel');
const Class = require('../models/classmodel');
const Complaint = require('../models/compaintmodel');
const EnrollmentRequest = require("../models/EnrollmentRequest");
const crypto = require("crypto");
const mongoose = require('mongoose');




// Department Representative Login Page
exports.loginRepPage = async (req, res) => {
  try {
    const departments = await Department.find({}, 'departmentname _id'); // Fetch department name and ID
    res.json(departments); // Send departments data as JSON to the frontend
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading login page');
  }
};

// Handle Login
exports.handleRepLogin = async (req, res) => {
  const { username, password, department } = req.body;

  try {
    const deptRep = await DeptRep.findOne({ username, password }).populate('departmentname');

    if (!deptRep || deptRep.departmentname._id.toString() !== department) {
      return res.status(400).json({
        error: 'Invalid username, password, or department',
      });
    }

    req.session.user = {
      id: deptRep._id,
      username: deptRep.username,
      departmentId: deptRep.departmentname._id,
      departmentName: deptRep.departmentname.departmentname,
    };
    console.log(req.session.user)

    return res.status(200).json({ message: 'Login successful' }); // Login successful response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Route to get logged-in user data
exports.getSessionUser = (req, res) => {
  if (req.session.user) {
    res.status(200).json(req.session.user);
  } else {
    res.status(401).json({ error: 'No user logged in' });
  }
};


// Logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Could not log out.');
      }
      console.log('session destroyed')
      res.redirect('/deptrep/login'); // Redirect to login page after logout
  });
};


//Student manage
//Manage student get/post/remove
// ✅ GET: Fetch students for the representative's department
exports.getStudents = async (req, res) => {
  try {
    const { departmentId } = req.session.user; // Department ID from session
    const students = await Student.find({ departmentname: departmentId }).populate('departmentname className');
    res.json({ students });
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ message: 'Failed to fetch students' });
  }
};

// ✅ POST: Add a new student to the representative's department
exports.postAddStudent = async (req, res) => {
  const { username, password, admno, name, className } = req.body;
  const { departmentId } = req.session.user; // Department ID from session

  try {
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(400).json({ message: 'Department not found' });
    }

    const studentClass = department.classes.find(cls => cls._id.toString() === className);
    if (!studentClass) {
      return res.status(400).json({ message: 'Class not found in the selected department' });
    }

    const newStudent = new Student({
      username,
      password,
      admno,
      name,
      className: studentClass._id,
      departmentname: departmentId,
    });

    await newStudent.save();

    const students = await Student.find({ departmentname: departmentId }).populate('departmentname className');
    res.json({ message: 'Student added successfully!', students });
  } catch (err) {
    console.error('Error adding student:', err);
    res.status(500).json({
      message: err.code === 11000 ? 'Username already exists.' : 'Failed to add student',
    });
  }
};

// ✅ POST: Remove a student from the representative's department
exports.removeStudent = async (req, res) => {
  const studentId = req.params.id;
  const { departmentId } = req.session.user;

  try {
    const student = await Student.findOne({ _id: studentId, departmentname: departmentId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found in your department' });
    }

    await Student.findByIdAndDelete(studentId);

    const students = await Student.find({ departmentname: departmentId }).populate('departmentname className');
    res.json({ message: 'Student removed successfully!', students });
  } catch (err) {
    console.error('Error removing student:', err);
    res.status(500).json({ message: 'Failed to remove student' });
  }
};

// ✅ GET: Fetch classes for a given department
exports.getClassesByDepartment = async (req, res) => {
  const { departmentId } = req.params;

  try {
    const department = await Department.findById(departmentId).populate('classes');
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.json({ classes: department.classes });
  } catch (err) {
    console.error('Error fetching classes:', err);
    res.status(500).json({ message: 'Failed to fetch classes' });
  }
};



//Department wise Rankings

//get department-wise rankings
exports.getDepartmentRankings = async (req, res) => {
    try {
      // Aggregate points by department
      const departmentRankings = await Scoreboard.aggregate([
        {
          $group: {
            _id: "$departmentname", // Group by department ID
            totalPoints: { $sum: "$points" } // Sum the points for each department
          }
        },
        {
          $lookup: {
            from: "departmentdetails", // Lookup the department details collection
            localField: "_id", // Match department ID
            foreignField: "_id", // Match department ID in the departmentdetails collection
            as: "department" // The result will be in the "department" field
          }
        },
        {
          $unwind: "$department" // Unwind the array to get the department name
        },
        {
          $project: {
            departmentName: "$department.departmentname", // Department name
            totalPoints: 1, // Total points
          }
        },
        {
          $sort: { totalPoints: -1 } // Sort by total points in descending order
        }
      ]);
  
  
      // Render the EJS page and pass the department rankings data
      res.render('view-department-rank', { 
        error: null, 
        success: null, 
        departmentRankings: departmentRankings 
      });
    } catch (error) {
      console.error('Error fetching department rankings:', error);
      res.render('view-department-rank', { 
        error: 'Failed to load department rankings.', 
        success: null, 
        departmentRankings: [] 
      });
    }
  };

//view announcements page
exports.getViewAnnouncements = async (req, res) => {
    try {
      // Fetch all announcements from the database
      const announcements = await Announcement.find().sort({ datePosted: -1 }); // Sort by latest posted first
  
      // Render the EJS page and pass the announcements data
      res.render('view-announcements', { 
        error: null, 
        success: null, 
        announcements: announcements
      });
    } catch (error) {
      console.error('Error fetching announcements:', error);
      res.render('view-announcements', { 
        error: 'Failed to load announcements.', 
        success: null, 
        announcements: [] 
      });
    }
  };

//view scoreboard
exports.getViewScoreboard = async (req, res) => {
  try {
    // Fetch all scoreboards and populate the department name
    const scoreboards = await Scoreboard.find()
      .populate('departmentname', 'departmentname') // Populate the department name field
      .sort({ lastUpdated: -1 }); // Sort by the last updated time, latest first

    // Render the EJS page and pass the scoreboards data
    res.render('view-scoreboard', { 
      error: null, 
      success: null, 
      scoreboards: scoreboards
    });
  } catch (error) {
    console.error('Error fetching scoreboards:', error);
    res.render('view-scoreboard', { 
      error: 'Failed to load scoreboards.', 
      success: null, 
      scoreboards: [] 
    });
  }
};


// Get Registration Form
// Controller to handle registration
exports.registerEvent = async (req, res) => {
  try {
    const { eventId, participants, participantHash, department } = req.body;

    // Validate event existence
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if all participants are valid
    const participantsData = await Promise.all(participants.map(async (participant) => {
      const student = await Student.findOne({ name: participant.name });
      if (!student) {
        throw new Error(`Student with name ${participant.name} not found`);
      }

      const className = await Class.findById(student.className); // assuming className is an ObjectId
      if (!className) {
        throw new Error(`Class not found for student ${participant.name}`);
      }

      return {
        name: student.name,
        className: className.name, // assuming class has a `name` field
      };
    }));

    // Validate participant limit
    if (participantsData.length > event.participants) {
      return res
        .status(400)
        .json({ error: `The event allows a maximum of ${event.participants} participants` });
    }

    // Create enrollment request
    const enrollmentRequest = new EnrollmentRequest({
      eventId,
      participants: participantsData,
      participantHash,
      department,
    });

    await enrollmentRequest.save();
    res.status(201).json({ message: "Event registration successful!" });
  } catch (error) {
    console.error("Error in registerEvent:", error);
    res.status(500).json({ error: error.message || "An error occurred. Please try again." });
  }
};




// Controller to fetch students for autocomplete
exports.getAllStudents = async (req, res) => {
  try {
    const { departmentId } = req.session.user; // Department ID from session
    const students = await Student.find({ departmentname: departmentId })
      .populate('departmentname className', 'name') // Populate only the 'name' field from className
      .select('name className'); // Select only the name and className fields

    // Extract class name as a string for each student
    const formattedStudents = students.map(student => ({
      ...student.toObject(),
      className: student.className.name, // Assuming className has a 'name' field
    }));

    res.json({ students: formattedStudents });
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ message: 'Failed to fetch students' });
  }
};


exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({ events });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "An error occurred while fetching events." });
  }
};


// View complaints for the logged-in department representative
exports.viewComplaints = async (req, res) => {
  try {
    const departmentId = req.session.user.departmentId;

    // Find complaints for the department
    const complaints = await Complaint.find({ department: departmentId })
      .populate('studentId', 'name rollno') // Populate student details
      .sort({ createdAt: -1 }); // Sort by newest first

    res.render('view-complaints', { complaints });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching complaints');
  }
};

// Handle reply to a complaint
exports.replyToComplaint = async (req, res) => {
  const { complaintId, replyText } = req.body;

  try {
    // Find the complaint and update the reply
    const complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      {
        reply: replyText,
        repliedAt: new Date(),
      },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).send('Complaint not found');
    }

    res.redirect('/deptrep/view-complaints');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error replying to complaint');
  }
};

 

exports.manageProfile = (req, res) => {
    res.render('manage-rep-profile');
};

exports.viewRegistrations = (req, res) => {
    res.render('view-registrations');
};

