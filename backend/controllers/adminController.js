const mongoose = require('mongoose');
const Admin = require('../models/admin');
const DeptRep = require('../models/deprepmodel');
const Department = require('../models/departmentmodel');
const Event = require('../models/eventmodel');
const Announcement = require('../models/announcementmodel');
const Scoreboard = require('../models/scoreboardmodel');
const Student = require('../models/studentmodel');
const Feedback = require('../models/feedback');
const Class = require('../models/classmodel');



// Admin Login
exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the admin by username and password
    const admin = await Admin.findOne({ username, password });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Set session after successful login
    req.session.user = {
      id: admin._id,
      username: admin.username,
    };

    return res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};


// Get session user details (for validating session)
exports.getSessionUser = (req, res) => {
  if (req.session.user) {
    return res.status(200).json(req.session.user);
  } else {
    return res.status(401).json({ error: 'No user logged in' });
  }
};

// Admin logout (to clear session)
exports.adminLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    return res.status(200).json({ message: 'Logged out successfully' });
  });
};


// Reprsentative Manage
// Manage add/remove Rep user
exports.getAddRepForm = async (req, res) => {
  try {
    const departments = await Department.find();
    const representatives = await DeptRep.find().populate('departmentname');
    res.json({ departments, representatives });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching data' });
  }
};

exports.postAddRep = async (req, res) => {
  const { username, password, name, departmentname } = req.body;

  try {
    const department = await Department.findById(departmentname);
    if (!department) {
      return res.status(400).json({ message: 'Department not found' });
    }

    const existingRep = await DeptRep.findOne({ departmentname });
    if (existingRep) {
      return res.status(400).json({ message: 'Department already has a representative.' });
    }

    // Check if the username is already in use
    const existingUser = await DeptRep.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    const newRep = new DeptRep({ username, password, name, departmentname });
    await newRep.save();

    const representatives = await DeptRep.find().populate('departmentname');
    res.status(201).json({ message: 'Representative added successfully', representatives });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.code === 11000 ? 'Username already exists' : 'Failed to add representative',
    });
  }
};

exports.removeRep = async (req, res) => {
  const repId = req.params.id;

  try {
    await DeptRep.findByIdAndDelete(repId);

    const representatives = await DeptRep.find().populate('departmentname');
    res.status(200).json({ message: 'Representative removed successfully', representatives });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to remove representative' });
  }
};


// ✅ GET: Fetch all departments (with classes populated)
exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate('classes');
    res.json({ departments });
  } catch (err) {
    console.error('Error fetching departments:', err);
    res.status(500).json({ message: 'Failed to fetch departments' });
  }
};

// ✅ GET: Fetch all students (with departments and classes populated)
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('departmentname className');
    res.json({ students });
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ message: 'Failed to fetch students' });
  }
};

// ✅ POST: Add a new student
exports.postAddStudent = async (req, res) => {
  const { username, password, admno, name, className, departmentname } = req.body;

  try {
    const department = await Department.findById(departmentname);
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
      departmentname
    });

    await newStudent.save();

    const students = await Student.find().populate('departmentname className');
    res.json({ message: 'Student added successfully!', students });
  } catch (err) {
    console.error('Error adding student:', err);
    res.status(500).json({
      message: err.code === 11000 ? 'Username already exists.' : 'Failed to add student'
    });
  }
};

// ✅ POST: Remove a student by ID
exports.removeStudent = async (req, res) => {
  const studentId = req.params.id;

  try {
    await Student.findByIdAndDelete(studentId);

    const students = await Student.find().populate('departmentname className');
    res.json({ message: 'Student removed successfully!', students });
  } catch (err) {
    console.error('Error removing student:', err);
    res.status(500).json({ message: 'Failed to remove student' });
  }
};

// ✅ GET: Fetch classes based on the selected department
exports.getClassesByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      return res.status(400).json({ message: 'Invalid department ID' });
    }

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




// Event form

// Add event form
exports.getAddEventForm = (req, res) => {
  // Render a placeholder response for now; not necessary for API calls
  res.status(200).send({ message: 'Ready to handle POST requests' });
};

// Handle the submission of the event form
exports.postAddEvent = async (req, res) => {
  const { eventname, category, participants, date, description } = req.body;

  try {
    // Validate input
    if (!eventname || !category || !participants || !date || !description) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Create and save the event
    const newEvent = new Event({ eventname, category, participants, date, description });
    await newEvent.save();

    res.status(201).json({ success: true, message: 'Event added successfully' });
  } catch (err) {
    console.error('Error saving event:', err);
    res.status(500).json({ success: false, message: 'Failed to save event. Please try again.' });
  }
};



// Announcement GET/POST/VIEW

exports.postAnnouncement = async (req, res) => {
  try {
    const { title, content, audience } = req.body;

    // Assuming Announcement is a Mongoose model
    const newAnnouncement = new Announcement({
      title,
      content,
      audience,
      datePosted: new Date(),
    });

    await newAnnouncement.save();

    // Respond back to client with success message
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error posting announcement:', error);
    res.status(500).json({ success: false, error: 'Error posting announcement.' });
  }
};

exports.getViewAnnouncements = async (req, res) => {
  try {
    // Fetch announcements from the database
    const announcements = await Announcement.find().sort({ datePosted: -1 });

    if (!announcements || announcements.length === 0) {
      return res.status(404).json({ message: 'No announcements found' });
    }

    res.json({ announcements });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ message: 'Failed to load announcements. Please try again.' });
  }
};




//Add Scoreboard GET/POST/VIEW

//get Scoreboard
// Get events and categories
exports.getEventsAndCategories = async (req, res) => {
  try {
    const events = await Event.find();
    return res.json(events);
  } catch (error) {
    console.error('Error fetching events and categories:', error);
    return res.status(500).send('Server Error');
  }
};

// Get departments and their associated classes for the frontend 
exports.getDepartmentsAndClasses = async (req, res) => {
  try {
    // Fetch departments with the populated 'classes' field
    const departments = await Department.find().populate('classes');

    if (!departments || departments.length === 0) {
      return res.status(404).json({ message: 'No departments found' });
    }

    return res.json(departments);
  } catch (error) {
    console.error('Error fetching departments and classes:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// Get students with populated department and class details
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find({}, 'name departmentname className')
      .populate('departmentname', 'departmentname')
      .populate('className', 'className');
    return res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    return res.status(500).json({ error: 'Server error fetching students.' });
  }
};

// Add a scoreboard entry with nested winners
exports.addScoreboard = async (req, res) => {
  const { eventName, category, winners, departmentname } = req.body;

  try {
    // Validate required fields
    if (!eventName || !category || !winners || !departmentname) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Validate that winners object has all three positions
    const positions = ['first', 'second', 'third'];
    for (const pos of positions) {
      if (
        !winners[pos] ||
        !winners[pos].studentNames ||
        !winners[pos].classNames ||
        !winners[pos].grade ||
        winners[pos].points === undefined
      ) {
        return res
          .status(400)
          .json({ error: `Missing or incomplete data for ${pos} winner.` });
      }

      // Validate that studentNames and classNames arrays match in length.
      if (winners[pos].studentNames.length !== winners[pos].classNames.length) {
        return res
          .status(400)
          .json({ error: `Mismatch between students and classes for ${pos} winner.` });
      }
    }

    // Validate department ObjectId
    if (!mongoose.Types.ObjectId.isValid(departmentname)) {
      return res.status(400).json({ error: 'Invalid department ID.' });
    }

    // Validate each classId for every position using a loop instead of forEach
    for (const pos of positions) {
      for (const classId of winners[pos].classNames) {
        if (!mongoose.Types.ObjectId.isValid(classId)) {
          return res
            .status(400)
            .json({ error: `Invalid class ID(s) provided for ${pos} winner.` });
        }
      }
    }

    // Validate and transform points to a number for each position
    for (const pos of positions) {
      winners[pos].points = parseInt(winners[pos].points, 10);
      if (isNaN(winners[pos].points)) {
        return res.status(400).json({ error: `Invalid points value for ${pos} winner.` });
      }
    }

    // Optionally, you could validate that the department exists or that classes belong to that department

    // Create and save the scoreboard entry
    const scoreboard = new Scoreboard({
      eventName,
      category,
      winners,
      departmentname,
    });

    console.log('Scoreboard object created:', scoreboard);

    await scoreboard.save();

    return res.status(201).json({
      success: 'Scoreboard entry added successfully.',
      data: scoreboard,
    });
  } catch (err) {
    console.error('Error adding scoreboard:', err);
    return res
      .status(500)
      .json({ error: 'Server error while adding scoreboard entry.' });
  }
};



//View scoreboard
// controllers/adminController.js
exports.getViewScoreboard = async (req, res) => {
  try {
    console.log("Fetching scoreboard data...");

    // Populate department and the nested winners' classNames.
    const scoreboards = await Scoreboard.find()
      .populate('departmentname', 'departmentname')
      .populate({ 
        path: 'winners.first.classNames', 
        model: 'Class', 
        select: 'className' 
      })
      .populate({ 
        path: 'winners.second.classNames', 
        model: 'Class', 
        select: 'className' 
      })
      .populate({ 
        path: 'winners.third.classNames', 
        model: 'Class', 
        select: 'className' 
      })
      .sort({ lastUpdated: -1 });

    // Helper function to safely format a winner object.
    const formatWinner = (winner) => {
      if (!winner || !winner.studentNames || !Array.isArray(winner.studentNames)) {
        return [];
      }
      return winner.studentNames.map((studentName, index) => {
        let className = "";
        if (winner.classNames && winner.classNames[index] && typeof winner.classNames[index] === 'object') {
          className = winner.classNames[index].className;
        } else if (winner.classNames && winner.classNames[index]) {
          className = winner.classNames[index].toString();
        }
        return {
          studentName,
          grade: winner.grade,
          points: winner.points,
          className,
        };
      });
    };

    // Format each scoreboard document so that winners are grouped and formatted.
    const formattedScoreboards = scoreboards.map(scoreboard => {
      return {
        _id: scoreboard._id,
        eventName: scoreboard.eventName,
        category: scoreboard.category,
        lastUpdated: scoreboard.lastUpdated,
        winners: {
          first: formatWinner(scoreboard.winners ? scoreboard.winners.first : null),
          second: formatWinner(scoreboard.winners ? scoreboard.winners.second : null),
          third: formatWinner(scoreboard.winners ? scoreboard.winners.third : null)
        },
        // Ensure department is an object with departmentname
        department: typeof scoreboard.departmentname === 'string'
          ? { departmentname: scoreboard.departmentname }
          : scoreboard.departmentname,
      };
    });

    res.status(200).json({ scoreboards: formattedScoreboards });
  } catch (error) {
    console.error('Error fetching scoreboards:', error);
    res.status(500).json({ message: 'Failed to load scoreboards.' });
  }
};



//Department wise Rankings

//get department-wise rankings
exports.getDepartmentRankings = async (req, res) => {
  try {
    const departmentRankings = await Scoreboard.aggregate([
      {
        $group: {
          _id: "$departmentname",
          totalPoints: { $sum: "$points" }
        }
      },
      {
        $lookup: {
          from: "departmentdetails",
          localField: "_id",
          foreignField: "_id",
          as: "department"
        }
      },
      {
        $unwind: "$department"
      },
      {
        $project: {
          departmentName: "$department.departmentname",
          totalPoints: 1
        }
      },
      {
        $sort: { totalPoints: -1 }
      }
    ]);

    res.status(200).json({ departmentRankings });
  } catch (error) {
    console.error('Error fetching department rankings:', error);
    res.status(500).json({ error: 'Failed to load department rankings.' });
  }
};


exports.viewRegistrations = async (req, res) => {
  try {
      if (!req.session.user) {
          return res.status(401).send('User not authenticated');
      }

      const loggedInRep = await DeptRep.findById(req.session.user.id).populate('departmentname');
      if (!loggedInRep) {
          return res.status(404).send('Department Representative not found');
      }

      // Fetch all registrations for the logged-in department
      const registrations = await Registration.find({ department: loggedInRep.departmentname._id })
          .populate('event')
          .populate('className')
          .populate('students');

      // Render the registrations view
      res.render('viewRegistrations', {
          registrations,
          departmentName: loggedInRep.departmentname.departmentname
      });
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
};

// Fetch and display all feedback for the admin
exports.viewFeedback = async (req, res) => {
  try {
    // Fetch all feedback with student details
    const feedbacks = await Feedback.find().populate("studentName");

    // Send feedbacks to the frontend
    res.json({ feedbacks });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Error fetching feedback" });
  }
};