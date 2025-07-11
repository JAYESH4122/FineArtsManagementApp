const Department = require("../models/departmentmodel");
const Student = require("../models/studentmodel");
const Announcement = require("../models/announcementmodel");
const Scoreboard = require("../models/scoreboardmodel");
const Registration = require("../models/registrationmodel");
const DeptRep = require("../models/deprepmodel");
const Event = require("../models/eventmodel");
const Class = require("../models/classmodel");
const Complaint = require("../models/compaintmodel");
const EnrollmentRequest = require("../models/EnrollmentRequest");
const jwt = require("jsonwebtoken");

exports.loginRepPage = async (req, res) => {
  try {
    const departments = await Department.find({}, "departmentname _id");
    res.json(departments);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading login page");
  }
};


exports.handleRepLogin = async (req, res) => {
  const { username, password, department } = req.body;

  try {
    const deptRep = await DeptRep.findOne({ username, password }).populate(
      "departmentname"
    );

    if (!deptRep || deptRep.departmentname._id.toString() !== department) {
      return res.status(400).json({
        error: "Invalid username, password, or department",
      });
    }
    const token = jwt.sign(
      {
        id: deptRep._id,
        username: deptRep.username,
        departmentId: deptRep.departmentname._id,
        departmentName: deptRep.departmentname.departmentname,
        role: "deptrep",
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
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getAuthenticatedUser = (req, res) => {
  if (req.user) {
    return res.status(200).json(req.user);
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Could not log out.");
    }
    console.log("session destroyed");
    res.redirect("/deptrep/login"); // Redirect to login page after logout
  });
};

//Student manage
//Manage student get/post/remove
exports.getStudents = async (req, res) => {
  try {
    const { departmentId } = req.session.user;
    const students = await Student.find({
      departmentname: departmentId,
    }).populate("departmentname className");
    res.json({ students });
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

exports.postAddStudent = async (req, res) => {
  const { username, password, admno, name, className } = req.body;
  const { departmentId } = req.session.user;

  try {
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(400).json({ message: "Department not found" });
    }

    const studentClass = department.classes.find(
      (cls) => cls._id.toString() === className
    );
    if (!studentClass) {
      return res
        .status(400)
        .json({ message: "Class not found in the selected department" });
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

    const students = await Student.find({
      departmentname: departmentId,
    }).populate("departmentname className");
    res.json({ message: "Student added successfully!", students });
  } catch (err) {
    console.error("Error adding student:", err);
    res.status(500).json({
      message:
        err.code === 11000
          ? "Username already exists."
          : "Failed to add student",
    });
  }
};

// ✅ POST: Remove a student from the representative's department
exports.removeStudent = async (req, res) => {
  const studentId = req.params.id;
  const { departmentId } = req.session.user;

  try {
    const student = await Student.findOne({
      _id: studentId,
      departmentname: departmentId,
    });
    if (!student) {
      return res
        .status(404)
        .json({ message: "Student not found in your department" });
    }

    await Student.findByIdAndDelete(studentId);

    const students = await Student.find({
      departmentname: departmentId,
    }).populate("departmentname className");
    res.json({ message: "Student removed successfully!", students });
  } catch (err) {
    console.error("Error removing student:", err);
    res.status(500).json({ message: "Failed to remove student" });
  }
};

// ✅ GET: Fetch classes for a given department
exports.getClassesByDepartment = async (req, res) => {
  const { departmentId } = req.params;

  try {
    const department = await Department.findById(departmentId).populate(
      "classes"
    );
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.json({ classes: department.classes });
  } catch (err) {
    console.error("Error fetching classes:", err);
    res.status(500).json({ message: "Failed to fetch classes" });
  }
};

// Get Registration Form
// Controller to handle registration

exports.registerEvent = async (req, res) => {
  try {
    const { eventId, participants } = req.body;

    const department = req.session.user.departmentId;
    if (!department) {
      return res
        .status(400)
        .json({ error: "Department is not defined in the session" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const participantsData = await Promise.all(
      participants.map(async (participant) => {
        const student = await Student.findOne({ name: participant.name });
        if (!student) {
          throw new Error(`Student with name ${participant.name} not found`);
        }

        const classData = await Class.findOne({
          className: participant.className,
        });
        if (!classData) {
          throw new Error(`Class "${participant.className}" not found`);
        }

        return {
          name: student.name,
          admno: student.admno,
          className: classData._id,
        };
      })
    );

    if (participantsData.length > 1) {
      // Generate a unique team name for team events
      const teamName = `Team-${uuidv4().slice(0, 8)}`; // Short UUID for readability
      participantsData.forEach(
        (participant) => (participant.teamName = teamName)
      );
    }

    const participantHash = participantsData
      .map((participant) => `${eventId}-${participant.admno}`)
      .join("-");

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
    res
      .status(500)
      .json({ error: error.message || "An error occurred. Please try again." });
  }
};

// Controller to fetch students for autocomplete
exports.getAllStudents = async (req, res) => {
  try {
    if (!req.session.user || !req.session.user.departmentId) {
      return res
        .status(400)
        .json({ error: "User session expired or invalid." });
    }

    const { departmentId } = req.session.user;
    console.log("Fetching students for department:", departmentId); // Debugging

    const students = await Student.find({ departmentname: departmentId })
      .populate("departmentname", "departmentname")
      .populate("className", "className")
      .select("name className admno");

    if (!students.length) {
      return res
        .status(404)
        .json({ error: "No students found in this department." });
    }

    const formattedStudents = students.map((student) => ({
      ...student.toObject(),
      className: student.className.className, // Ensure it's a string, not ObjectId
    }));

    res.json({ students: formattedStudents });
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ error: "Failed to fetch students." });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().select("_id eventname participants"); // Fetch only required fields
    if (!events.length) {
      return res.status(404).json({ error: "No events found." });
    }
    res.status(200).json({ events });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "An error occurred while fetching events." });
  }
};

// Get complaints for department representative
exports.getDeptRepComplaints = async (req, res) => {
  try {
    const { departmentId } = req.session.user;

    const complaints = await Complaint.find({ department: departmentId })
      .populate("studentId", "name rollno")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching complaints." });
  }
};

// Reply to a complaint
exports.replyToComplaint = async (req, res) => {
  const { complaintId, replyText } = req.body;

  try {
    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found." });
    }

    complaint.reply = replyText;
    complaint.repliedAt = new Date();
    await complaint.save();

    res.json({ message: "Reply submitted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error submitting reply." });
  }
};

// Controller to fetch all event registrations
exports.getAllRegistrations = async (req, res) => {
  try {
    const registrations = await EnrollmentRequest.find()
      .populate("eventId", "eventname") // Populate event details
      .populate("participants.className", "className") // Populate class name
      .populate({ path: "department", select: "departmentname" }) // Populate department name
      .exec();

    console.log(registrations.departmentname);
    // Group participants by event name
    const groupedRegistrations = {};

    registrations.forEach((registration) => {
      const eventname = registration.eventId.eventname;

      if (!groupedRegistrations[eventname]) {
        groupedRegistrations[eventname] = [];
      }

      // Check if this is a team event
      const isTeamEvent = registration.participants.length > 1;
      const teamName = isTeamEvent
        ? registration.participants[0].teamName
        : null;

      // Add participants under the event, grouping by team name if applicable
      groupedRegistrations[eventname].push({
        teamName: isTeamEvent ? teamName : null,
        participants: registration.participants.map((participant) => ({
          name: participant.name,
          className: participant.className.className,
          department: registration.department.departmentname,
        })),
      });
    });

    // Format the response as an array
    const formattedResponse = Object.entries(groupedRegistrations).map(
      ([eventname, teams]) => ({
        eventname,
        teams,
      })
    );

    // Sort the array by event name
    formattedResponse.sort((a, b) => a.eventname.localeCompare(b.eventname));

    res.status(200).json({ registrations: formattedResponse });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching registrations." });
  }
};
