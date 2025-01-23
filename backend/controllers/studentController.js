const Complaint = require('../models/compaintmodel');
const Student = require('../models/studentmodel'); // Adjust the path according to your folder structure
const Feedback = require('../models/feedback');
const DeptRep = require('../models/deprepmodel');
const Department = require('../models/departmentmodel');
const Event = require('../models/eventmodel');
const EnrollmentRequest = require('../models/EnrollmentRequest');
const Class = require('../models/classmodel');
const crypto = require('crypto');


// Handle Student Login
exports.handleStudentLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the student and populate the department details
    const student = await Student.findOne({ username, password })
      .populate('departmentname', '_id departmentname') // Populate department ID and name
      .populate('className', 'className'); // Populate class name if needed

    if (!student) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Save student info in session
    req.session.user = {
      id: student._id,
      username: student.username,
      name: student.name,
      rollno: student.rollno,
      admno: student.admno,
      departmentId: student.departmentname?._id, // Use the populated department ID
      departmentName: student.departmentname?.departmentname, // Add department name if needed
      className: student.className?.className, // Add class name for completeness
    };

    console.log('Session user:', req.session.user);

    return res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Could not log out.');
      }
      console.log('session destroyed')
      res.redirect('/student/login'); // Redirect to login page after logout
  });
};

// Student Dashboard
exports.dashboard = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { name, rollno, departmentId } = req.session.user;

  // Fetch department details if needed (assuming you have a Department model)
  try {
    const department = await Department.findById(departmentId);
    res.status(200).json({
      name,
      rollno,
      departmentName: department ? department.name : 'N/A',  // Use 'N/A' if no department found
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch department' });
  }
};

// Logout Route
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    return res.status(200).json({ message: 'Logged out successfully' });
  });
};


// Student Enrollment
// Controller to get events with single participants only
exports.getEvents = async (req, res) => {
  try {
    // Fetch events where participants count is exactly 1 (students can only register for these)
    const events = await Event.find({ participants: 1 }, 'eventname participants category description date');
    
    if (events.length === 0) {
      return res.status(404).json({ message: 'No single-participant events found' });
    }

    res.json({ events });
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ message: 'Failed to fetch events', error: err.message });
  }
};

// In your studentController.js or a relevant controller file
exports.getSessionUserData = (req, res) => {
  const user = req.session.user;

  // Check if session data exists
  if (!user) {
    return res.status(401).json({ message: 'Not logged in' });
  }

  // Return session data (student's name, class, and other details)
  return res.status(200).json({
    name: user.name,
    className: user.className,
    departmentName: user.departmentName,
  });
};


// Get classes for the logged-in student’s department
// Handle fetching classes based on department ID
exports.getClasses = async (req, res) => {
  try {
    // Fetch the departmentId from session data
    const departmentId = req.session.user?.departmentId;
    
    // Ensure the departmentId is present in session
    if (!departmentId) {
      return res.status(400).json({ message: 'Department ID is missing in the session' });
    }

    // Find the department and populate the classes array
    const department = await Department.findById(departmentId).populate('classes');
    
    // If no department found, return error
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Send the classes back to the client
    res.json({ classes: department.classes });
  } catch (err) {
    console.error('Error fetching classes:', err);
    res.status(500).json({ message: 'Failed to fetch classes' });
  }
};


// Controller to handle student enrollment requests
exports.requestEnrollment = async (req, res) => {
  const { eventId, participantDetails } = req.body;

  if (!eventId || !participantDetails || participantDetails.length === 0) {
    return res.status(400).json({ message: 'Event ID and participant details are required' });
  }

  try {
    const studentId = req.session.user?.id;

    if (!studentId) {
      return res.status(401).json({ message: 'User not logged in or session expired' });
    }

    // Check if the student has already submitted a request for this event
    const existingRequest = await EnrollmentRequest.findOne({
      eventId,
      'participants.name': participantDetails[0].name, // Match participant name
    });

    if (existingRequest) {
      return res.status(400).json({
        message: `You have already enrolled for this event.`,
      });
    }

    // Resolve the class name into its ObjectId
    const className = participantDetails[0].className;
    const classRecord = await Class.findOne({ className });

    if (!classRecord) {
      return res.status(404).json({ message: `Class with name "${className}" not found.` });
    }

    // Create the enrollment request
    const enrollmentRequest = new EnrollmentRequest({
      eventId,
      participants: [
        {
          name: participantDetails[0].name,
          className: classRecord._id, // Use the ObjectId
        },
      ],
      participantHash: `${eventId}-${participantDetails[0].name}`, // Generate unique hash
      department: req.session.user.departmentId,
    });

    // Save the request and populate the event details
    const savedRequest = await enrollmentRequest.save();

    // Populate event details after saving
    await savedRequest.populate({
      path: 'eventId',
      select: 'eventname category date', // Correct fields
    });

    console.log('savedRequest', savedRequest); // This should print the populated event details

    return res.status(200).json({
      message: 'Enrollment request sent successfully!',
      request: savedRequest,
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};





// Controller to get all enrollment requests for the student
exports.getEnrollmentRequests = async (req, res) => {
  const studentId = req.session.user?.id; // Get logged-in student's ID from session
  if (!studentId) {
    return res.status(401).json({ message: 'Unauthorized access. Please log in.' });
  }

  try {
    // Find all enrollment requests for the student and populate event details
    const requests = await EnrollmentRequest.find({ 'participants.name': req.session.user.name })
    .populate('eventId', 'eventname category date')  // Ensure the 'category' and 'eventname' are selected
    .populate('participants.className', 'className');
  

    res.json({ requests });
    console.log('requests',requests); // Debugging to see the full response

  } catch (err) {
    console.error('Error fetching enrollment requests:', err);
    res.status(500).json({ message: 'Failed to fetch enrollment requests.' });
  }
};


exports.getAllEnrollmentRequests = async (req, res) => {
  try {
    // Fetch all enrollment requests and populate event and participant details
    const requests = await EnrollmentRequest.find()
      .populate('eventId', 'eventname category description date')  // Populate event details
      .populate('participants.className', 'className')  // Populate className details
      .populate('department', 'departmentName');  // Populate department details (ensure departmentName exists)

    if (requests.length === 0) {
      return res.status(404).json({ message: 'No enrollment requests found' });
    }

    res.json({ requests });
  } catch (err) {
    console.error('Error fetching enrollment requests:', err);
    res.status(500).json({ message: 'Failed to fetch enrollment requests' });
  }
};





// GET request: Load the Add Complaint page and display submitted complaints
exports.addComplaintPage = async (req, res) => {
  try {
    // Get the student's department and ID from the session
    const { id: studentId, departmentId } = req.session.user;

    // Fetch department representative details for the student's department
    const departmentRep = await DeptRep.findOne({ departmentname: departmentId }).populate('departmentname');

    // Fetch all complaints submitted by this student
    const complaints = await Complaint.find({ studentId })
      .populate('department', 'departmentname')
      .sort({ createdAt: -1 }); // Sort by newest first

    // Render the page with department representative details and complaints
    res.render('add-complaint', {
      repName: departmentRep ? departmentRep.name : 'N/A',
      departmentName: departmentRep ? departmentRep.departmentname.departmentname : 'N/A',
      complaints,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// POST request: Handle new complaint submission
exports.addComplaint = async (req, res) => {
  const { subject, description } = req.body;
  const studentId = req.session.user.id;
  const departmentId = req.session.user.departmentId;

  try {
    // Create a new complaint
    const newComplaint = new Complaint({
      studentId,
      department: departmentId,
      subject,
      complaintText: description,
    });

    await newComplaint.save();

    res.redirect('/student/add-complaint');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error submitting complaint');
  }
};


// Render the feedback form
exports.showFeedbackForm = (req, res) => {
  const studentId = req.session.user?.id; // Get student ID from session

  if (!studentId) {
    return res.redirect('/student/login'); // Redirect if not logged in
  }

  // Fetch the student data
  Student.findById(studentId)
    .then(student => {
      if (!student) {
        return res.status(404).send('Student not found');
      }

      // Render the feedback form with the student's name
      res.render('feedbackForm', { studentName: student.name });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error fetching student data');
    });
};

// Handle feedback form submission
exports.submitFeedback = (req, res) => {
  const { feedback } = req.body;
  const studentId = req.session.user?.id; // Get student ID from session

  if (!studentId) {
    return res.redirect('/student/login'); // Redirect if not logged in
  }

  // Fetch the student data to get their name
  Student.findById(studentId)
    .then(student => {
      if (!student) {
        return res.status(404).send('Student not found');
      }

      // Create a new feedback document
      const newFeedback = new Feedback({
        studentName: student._id,
        feedback,
      });

      // Save feedback to the database
      newFeedback.save()
        .then(() => {
          res.render('thankYou'); // Redirect to thank you page
        })
        .catch(err => {
          console.error(err);
          res.status(500).send('Error submitting feedback');
        });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error fetching student data');
    });
};