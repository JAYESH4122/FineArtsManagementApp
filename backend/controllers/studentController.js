const Complaint = require("../models/compaintmodel");
const Student = require("../models/studentmodel"); 
const Feedback = require("../models/feedback");
const DeptRep = require("../models/deprepmodel");
const Department = require("../models/departmentmodel");
const Event = require("../models/eventmodel");
const EnrollmentRequest = require("../models/EnrollmentRequest");
const jwt = require("jsonwebtoken");

exports.handleStudentLogin = async (req, res) => {
  const { admno, password } = req.body;

  try {
    const student = await Student.findOne({ admno, password })
      .populate("departmentname", "_id departmentname")
      .populate("className", "className");

    if (!student) {
      return res
        .status(401)
        .json({ message: "Invalid admission number or password" });
    }

    const token = jwt.sign(
      {
        id: student._id,
        username: student.username,
        role: "student",
        departmentId: student.departmentname?._id,
        className: student.className?.className,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Could not log out.");
    }
    console.log("session destroyed");
    res.redirect("/student/login");
  });
};

exports.dashboard = async (req, res) => {
  const { id, username, role } = req.user; 

  try {
    
    const student = await Student.findById(id)
      .populate("departmentname", "departmentname")
      .populate("className", "className");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      name: student.username,
      rollno: student.admno,
      departmentName: student.departmentname?.departmentname || "N/A",
      className: student.className?.className || "N/A",
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({ message: "Failed to fetch student info" });
  }
};


// Logout Route
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    return res.status(200).json({ message: "Logged out successfully" });
  });
};

// Student Enrollment
// Controller to get events with single participants only
exports.getEventsStudent = async (req, res) => {
  try {

    const events = await Event.find(
      { participants: 1 },
      "eventname participants category description date"
    );

    if (events.length === 0) {
      return res
        .status(404)
        .json({ message: "No single-participant events found" });
    }

    res.json({ events });
  } catch (err) {
    console.error("Error fetching events:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch events", error: err.message });
  }
};

exports.getSessionUserData = (req, res) => {
  const user = req.session.user;

  if (!user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  return res.status(200).json({
    name: user.name,
    className: user.className,
    departmentName: user.departmentName,
  });
};

exports.getClasses = async (req, res) => {
  try {

    const departmentId = req.session.user?.departmentId;

    if (!departmentId) {
      return res
        .status(400)
        .json({ message: "Department ID is missing in the session" });
    }

    const department = await Department.findById(departmentId).populate(
      "classes"
    );

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Send the classes back to the client
    res.json({ classes: department.classes });
  } catch (err) {
    console.error("Error fetching classes:", err);
    res.status(500).json({ message: "Failed to fetch classes" });
  }
};

// Controller to handle student enrollment requests
exports.requestEnrollment = async (req, res) => {
  const { eventId, participantDetails } = req.body;

  if (!eventId || !participantDetails || participantDetails.length === 0) {
    return res
      .status(400)
      .json({ message: "Event ID and participant details are required" });
  }

  try {
    const studentId = req.session.user?.id;

    if (!studentId) {
      return res
        .status(401)
        .json({ message: "User not logged in or session expired" });
    }

    const studentName = participantDetails[0].name;

    // Fetch the student details
    const student = await Student.findOne({ name: studentName }).populate(
      "className",
      "className"
    );

    if (!student) {
      return res
        .status(404)
        .json({ message: `Student with name "${studentName}" not found.` });
    }

    // Fetch event details to check the stage type
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    // Separate count for offstage and onstage events **(Fixed query)**
    const offstageEventCount = await EnrollmentRequest.countDocuments({
      "participants.admno": student.admno,
      eventId: { $in: await Event.find({ stage: "offstage" }).distinct("_id") },
    });

    const onstageEventCount = await EnrollmentRequest.countDocuments({
      "participants.admno": student.admno,
      eventId: { $in: await Event.find({ stage: "onstage" }).distinct("_id") },
    });

    // ✅ Now correctly enforce separate limits for each stage
    if (event.stage === "offstage" && offstageEventCount >= 4) {
      return res.status(400).json({
        message: `You have already registered for the maximum of 4 offstage events.`,
      });
    }

    if (event.stage === "onstage" && onstageEventCount >= 3) {
      return res.status(400).json({
        message: `You have already registered for the maximum of 3 onstage events.`,
      });
    }

    // Check if the student has already submitted a request for this specific event
    const existingRequest = await EnrollmentRequest.findOne({
      eventId,
      "participants.admno": student.admno,
    });

    if (existingRequest) {
      return res.status(400).json({
        message: `You have already enrolled for this event.`,
      });
    }

    // Ensure the student's class exists
    const classRecord = student.className;
    if (!classRecord) {
      return res
        .status(404)
        .json({ message: `Class not found for student "${studentName}".` });
    }

    // Create the enrollment request
    const enrollmentRequest = new EnrollmentRequest({
      eventId,
      participants: [
        {
          name: student.name,
          admno: student.admno,
          className: classRecord._id,
        },
      ],
      participantHash: `${eventId}-${student.admno}`,
      department: student.departmentname,
    });

    // Save the request
    const savedRequest = await enrollmentRequest.save();

    // Populate event details after saving
    await savedRequest.populate({
      path: "eventId",
      select: "eventname participants date stage",
    });

    console.log("savedRequest", savedRequest);

    return res.status(200).json({
      message: "Enrollment request sent successfully!",
      request: savedRequest,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};


exports.getEnrollmentRequests = async (req, res) => {
  const studentId = req.session.user?.id;
  if (!studentId) {
    return res
      .status(401)
      .json({ message: "Unauthorized access. Please log in." });
  }

  try {
    // Find all enrollment requests for the student and populate event details
    const requests = await EnrollmentRequest.find({
      "participants.name": req.session.user.name,
    })
      .populate("eventId", "eventname category date") // Ensure the 'category' and 'eventname' are selected
      .populate("participants.className", "className");

    res.json({ requests });
    console.log("requests", requests); // Debugging to see the full response
  } catch (err) {
    console.error("Error fetching enrollment requests:", err);
    res.status(500).json({ message: "Failed to fetch enrollment requests." });
  }
};

exports.getAllEnrollmentRequests = async (req, res) => {
  try {
    // Fetch all enrollment requests and populate event and participant details
    const requests = await EnrollmentRequest.find()
      .populate("eventId", "eventname category description date") // Populate event details
      .populate("participants.className", "className") // Populate className details
      .populate("department", "departmentName"); // Populate department details (ensure departmentName exists)

    if (requests.length === 0) {
      return res.status(404).json({ message: "No enrollment requests found" });
    }

    res.json({ requests });
  } catch (err) {
    console.error("Error fetching enrollment requests:", err);
    res.status(500).json({ message: "Failed to fetch enrollment requests" });
  }
};

// Get complaints for a student

exports.getStudentComplaints = async (req, res) => {
  try {
    const { id: studentId, departmentId } = req.session.user;

    // Fetch complaints by student
    const complaints = await Complaint.find({ studentId })
      .populate("department", "departmentname")
      .sort({ createdAt: -1 });

    // Fetch department representative for the student's department
    const departmentRep = await DeptRep.findOne({
      departmentname: departmentId,
    });

    res.json({
      complaints,
      departmentRepName: departmentRep ? departmentRep.name : "N/A", // Send the representative's name
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching complaints." });
  }
};

// Add a new complaint
exports.addComplaint = async (req, res) => {
  const { subject, description } = req.body;
  const { id: studentId, departmentId } = req.session.user;

  try {
    const newComplaint = new Complaint({
      studentId,
      department: departmentId,
      subject,
      complaintText: description,
    });

    await newComplaint.save();
    res.status(201).json({ message: "Complaint submitted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error submitting complaint." });
  }
};

// GET request: Provide student's name for the feedback form
// GET request: Provide student's name and department for the feedback form
exports.getFeedbackFormData = (req, res) => {
  const studentId = req.session.user?.id; // Get student ID from session

  if (!studentId) {
    return res.status(401).json({ message: "Unauthorized" }); // Return 401 if not logged in
  }

  // Fetch the student's name and department
  Student.findById(studentId)
    .populate("departmentname", "departmentname") // Populate the department name
    .then((student) => {
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      // Send the student's name and department as JSON
      res.status(200).json({
        studentName: student.name,
        departmentName:
          student.departmentname?.departmentname || "Unknown Department",
      });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ message: "Error fetching student data", error: err.message });
    });
};

// API to handle feedback submission
exports.submitFeedback = (req, res) => {
  const { feedback } = req.body;
  const studentId = req.session.user?.id;

  if (!studentId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  Student.findById(studentId)
    .then((student) => {
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      const newFeedback = new Feedback({
        studentName: student._id,
        feedback,
      });

      return newFeedback.save();
    })
    .then(() => {
      res.status(201).json({ message: "Feedback submitted successfully" });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Error submitting feedback" });
    });
};

// GET: Fetch the student profile
exports.getStudentProfile = async (req, res) => {
  const studentId = req.session.user?.id; // Get student ID from session

  if (!studentId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const student = await Student.findById(studentId)
      .populate("departmentname")
      .populate("className");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ student });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching student profile",
      error: error.message,
    });
  }
};

// POST: Update the student profile
exports.updateStudentProfile = async (req, res) => {
  const studentId = req.session.user?.id;
  const { phno, gmail, password } = req.body; // Include password

  if (!studentId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const updateFields = {};
    if (phno) updateFields.phno = phno;
    if (gmail) updateFields.gmail = gmail;
    if (password) updateFields.password = password; // Allow password update

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      updateFields,
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
};


exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({});
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
