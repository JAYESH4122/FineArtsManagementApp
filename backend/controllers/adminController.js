const mongoose = require("mongoose");
const Admin = require("../models/admin");
const DeptRep = require("../models/deprepmodel");
const Department = require("../models/departmentmodel");
const Event = require("../models/eventmodel");
const Announcement = require("../models/announcementmodel");
const Scoreboard = require("../models/scoreboardmodel");
const Student = require("../models/studentmodel");
const Feedback = require("../models/feedback");
const Class = require("../models/classmodel");
const EnrollmentRequest = require("../models/EnrollmentRequest");
const PDFDocument = require("pdfkit");
const jwt = require("jsonwebtoken");

exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username, password });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        username: admin.username,
        role: "admin",
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
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get session user details (for validating session)
exports.getSessionUser = (req, res) => {
  if (req.session.user) {
    return res.status(200).json(req.session.user);
  } else {
    return res.status(401).json({ error: "No user logged in" });
  }
};

// Admin logout (to clear session)
exports.adminLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    return res.status(200).json({ message: "Logged out successfully" });
  });
};

// Reprsentative Manage
// Manage add/remove Rep user
exports.getAddRepForm = async (req, res) => {
  try {
    const departments = await Department.find();
    const representatives = await DeptRep.find().populate("departmentname");
    res.json({ departments, representatives });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching data" });
  }
};

exports.postAddRep = async (req, res) => {
  const { username, password, name, departmentname } = req.body;

  try {
    const department = await Department.findById(departmentname);
    if (!department) {
      return res.status(400).json({ message: "Department not found" });
    }

    const existingRep = await DeptRep.findOne({ departmentname });
    if (existingRep) {
      return res
        .status(400)
        .json({ message: "Department already has a representative." });
    }

    // Check if the username is already in use
    const existingUser = await DeptRep.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists." });
    }

    const newRep = new DeptRep({ username, password, name, departmentname });
    await newRep.save();

    const representatives = await DeptRep.find().populate("departmentname");
    res
      .status(201)
      .json({ message: "Representative added successfully", representatives });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message:
        err.code === 11000
          ? "Username already exists"
          : "Failed to add representative",
    });
  }
};

exports.removeRep = async (req, res) => {
  const repId = req.params.id;

  try {
    await DeptRep.findByIdAndDelete(repId);

    const representatives = await DeptRep.find().populate("departmentname");
    res.status(200).json({
      message: "Representative removed successfully",
      representatives,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to remove representative" });
  }
};

// ✅ GET: Fetch all departments (with classes populated)
exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate("classes");
    res.json({ departments });
  } catch (err) {
    console.error("Error fetching departments:", err);
    res.status(500).json({ message: "Failed to fetch departments" });
  }
};

// ✅ GET: Fetch all students (with departments and classes populated)
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("departmentname className");
    res.json({ students });
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

// ✅ POST: Add a new student
exports.postAddStudent = async (req, res) => {
  const { username, password, admno, name, className, departmentname } =
    req.body;

  try {
    const department = await Department.findById(departmentname);
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
      departmentname,
    });

    await newStudent.save();

    const students = await Student.find().populate("departmentname className");
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

// ✅ POST: Remove a student by ID
exports.removeStudent = async (req, res) => {
  const studentId = req.params.id;

  try {
    await Student.findByIdAndDelete(studentId);

    const students = await Student.find().populate("departmentname className");
    res.json({ message: "Student removed successfully!", students });
  } catch (err) {
    console.error("Error removing student:", err);
    res.status(500).json({ message: "Failed to remove student" });
  }
};

// ✅ GET: Fetch classes based on the selected department
exports.getClassesByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      return res.status(400).json({ message: "Invalid department ID" });
    }

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

// Event form

// Add event form
exports.getAddEventForm = (req, res) => {
  // Render a placeholder response for now; not necessary for API calls
  res.status(200).send({ message: "Ready to handle POST requests" });
};

// Handle the submission of the event form
exports.postAddEvent = async (req, res) => {
  const { eventname, category, participants, date, description } = req.body;

  try {
    // Validate input
    if (!eventname || !category || !participants || !date || !description) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    // Create and save the event
    const newEvent = new Event({
      eventname,
      category,
      participants,
      date,
      description,
    });
    await newEvent.save();

    res
      .status(201)
      .json({ success: true, message: "Event added successfully" });
  } catch (err) {
    console.error("Error saving event:", err);
    res.status(500).json({
      success: false,
      message: "Failed to save event. Please try again.",
    });
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
    console.error("Error posting announcement:", error);
    res
      .status(500)
      .json({ success: false, error: "Error posting announcement." });
  }
};

exports.getViewAnnouncements = async (req, res) => {
  try {
    // Fetch announcements from the database
    const announcements = await Announcement.find().sort({ datePosted: -1 });

    if (!announcements || announcements.length === 0) {
      return res.status(404).json({ message: "No announcements found" });
    }

    res.json({ announcements });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res
      .status(500)
      .json({ message: "Failed to load announcements. Please try again." });
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
    console.error("Error fetching events and categories:", error);
    return res.status(500).send("Server Error");
  }
};

// Get departments and their associated classes for the frontend
exports.getDepartmentsAndClasses = async (req, res) => {
  try {
    // Fetch departments with the populated 'classes' field
    const departments = await Department.find().populate("classes");

    if (!departments || departments.length === 0) {
      return res.status(404).json({ message: "No departments found" });
    }

    return res.json(departments);
  } catch (error) {
    console.error("Error fetching departments and classes:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Get students with populated department and class details
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find({}, "name departmentname className")
      .populate("departmentname", "departmentname")
      .populate("className", "className");
    return res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({ error: "Server error fetching students." });
  }
};

// Add a scoreboard entry with nested winners
exports.addScoreboard = async (req, res) => {
  const { eventName, category, winners } = req.body;

  try {
    if (!eventName || !category || !winners) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const positions = ["first", "second", "third"];
    for (const pos of positions) {
      // Skip validation for empty positions (if not available or not won)
      if (winners[pos]) {
        if (
          !winners[pos].studentNames ||
          !winners[pos].classNames ||
          !winners[pos].grade ||
          winners[pos].points === undefined
        ) {
          return res
            .status(400)
            .json({ error: `Incomplete data for ${pos} winner.` });
        }

        // Fetch and validate department IDs for each student
        const departmentIds = await Promise.all(
          winners[pos].studentNames.map(async (studentName) => {
            const student = await Student.findOne({
              name: studentName,
            }).populate("departmentname", "_id");
            if (!student || !student.departmentname) {
              throw new Error(
                `Department not found for student: ${studentName}`
              );
            }
            return student.departmentname._id;
          })
        );

        winners[pos].departmentNames = departmentIds; // Store department IDs
      }
    }

    // Create scoreboard with optional positions
    const scoreboard = new Scoreboard({
      eventName,
      category,
      winners: {
        first: winners.first || null,
        second: winners.second || null,
        third: winners.third || null,
      },
    });

    await scoreboard.save();

    return res.status(201).json({
      success: "Scoreboard entry added successfully.",
      data: scoreboard,
    });
  } catch (err) {
    console.error("Error adding scoreboard:", err);
    return res.status(500).json({
      error: err.message || "Server error while adding scoreboard entry.",
    });
  }
};

//View scoreboard
// controllers/adminController.js
exports.getViewScoreboard = async (req, res) => {
  try {
    console.log("Fetching scoreboard data...");

    // Populate only classNames inside winners, since departmentname is not in Scoreboard
    const scoreboards = await Scoreboard.find()
      .populate({
        path: "winners.first.classNames",
        model: "Class",
        select: "className",
      })
      .populate({
        path: "winners.second.classNames",
        model: "Class",
        select: "className",
      })
      .populate({
        path: "winners.third.classNames",
        model: "Class",
        select: "className",
      })
      .populate({
        path: "winners.first.departmentNames",
        model: "DepartmentDetails",
        select: "departmentname",
      })
      .populate({
        path: "winners.second.departmentNames",
        model: "DepartmentDetails",
        select: "departmentname",
      })
      .populate({
        path: "winners.third.departmentNames",
        model: "DepartmentDetails",
        select: "departmentname",
      })
      .sort({ lastUpdated: -1 });

    // Helper function to format winners correctly
    const formatWinner = (winner) => {
      if (
        !winner ||
        !winner.studentNames ||
        !Array.isArray(winner.studentNames)
      ) {
        return [];
      }
      return winner.studentNames.map((studentName, index) => {
        let className = "";
        let departmentName = "N/A"; // Default if no department is found

        // Fetch class name
        if (
          winner.classNames &&
          winner.classNames[index] &&
          typeof winner.classNames[index] === "object"
        ) {
          className = winner.classNames[index].className;
        } else if (winner.classNames && winner.classNames[index]) {
          className = winner.classNames[index].toString();
        }

        // Fetch department name
        if (
          winner.departmentNames &&
          winner.departmentNames[index] &&
          typeof winner.departmentNames[index] === "object"
        ) {
          departmentName = winner.departmentNames[index].departmentname;
        }

        return {
          studentName,
          grade: winner.grade,
          points: winner.points,
          className,
          departmentName,
        };
      });
    };

    // Format each scoreboard document
    const formattedScoreboards = scoreboards.map((scoreboard) => ({
      _id: scoreboard._id,
      eventName: scoreboard.eventName,
      category: scoreboard.category,
      lastUpdated: scoreboard.lastUpdated,
      winners: {
        first: formatWinner(
          scoreboard.winners ? scoreboard.winners.first : null
        ),
        second: formatWinner(
          scoreboard.winners ? scoreboard.winners.second : null
        ),
        third: formatWinner(
          scoreboard.winners ? scoreboard.winners.third : null
        ),
      },
    }));

    res.status(200).json({ scoreboards: formattedScoreboards });
  } catch (error) {
    console.error("Error fetching scoreboards:", error);
    res.status(500).json({ message: "Failed to load scoreboards." });
  }
};

//Department wise Rankings

//get department-wise rankings
exports.getDepartmentRankings = async (req, res) => {
  try {
    console.log("Fetching department rankings...");

    const departmentRankings = await Scoreboard.aggregate([
      // Unwind winners to get all department placements
      {
        $project: {
          eventName: 1,
          firstPlaceDepartments: {
            $cond: {
              if: { $gt: [{ $size: "$winners.first.departmentNames" }, 0] },
              then: "$winners.first.departmentNames",
              else: [],
            },
          },
          secondPlaceDepartments: {
            $cond: {
              if: { $gt: [{ $size: "$winners.second.departmentNames" }, 0] },
              then: "$winners.second.departmentNames",
              else: [],
            },
          },
          thirdPlaceDepartments: {
            $cond: {
              if: { $gt: [{ $size: "$winners.third.departmentNames" }, 0] },
              then: "$winners.third.departmentNames",
              else: [],
            },
          },
          firstPlacePoints: "$winners.first.points",
          secondPlacePoints: "$winners.second.points",
          thirdPlacePoints: "$winners.third.points",
        },
      },

      // Lookup event details to check if it's a team event
      {
        $lookup: {
          from: "eventdetails",
          localField: "eventName",
          foreignField: "eventname",
          as: "eventDetails",
        },
      },
      { $unwind: { path: "$eventDetails", preserveNullAndEmptyArrays: true } },

      // Flatten department arrays while ensuring team events count only once per department
      {
        $unwind: {
          path: "$firstPlaceDepartments",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$secondPlaceDepartments",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$thirdPlaceDepartments",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Lookup department names for correct mapping
      {
        $lookup: {
          from: "departmentdetails",
          localField: "firstPlaceDepartments",
          foreignField: "_id",
          as: "firstDepartment",
        },
      },
      {
        $unwind: { path: "$firstDepartment", preserveNullAndEmptyArrays: true },
      },

      {
        $lookup: {
          from: "departmentdetails",
          localField: "secondPlaceDepartments",
          foreignField: "_id",
          as: "secondDepartment",
        },
      },
      {
        $unwind: {
          path: "$secondDepartment",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "departmentdetails",
          localField: "thirdPlaceDepartments",
          foreignField: "_id",
          as: "thirdDepartment",
        },
      },
      {
        $unwind: { path: "$thirdDepartment", preserveNullAndEmptyArrays: true },
      },

      // Assign points, ensuring team events count only once per department
      {
        $group: {
          _id: {
            department: "$firstDepartment.departmentname",
            event: "$eventName",
            isTeamEvent: { $gt: ["$eventDetails.participants", 1] },
          },
          points: { $max: "$firstPlacePoints" }, // Prevent duplicates by taking max
        },
      },
      {
        $group: {
          _id: "$_id.department",
          totalPoints: { $sum: "$points" },
        },
      },

      // Merge second and third place rankings in the same way
      {
        $unionWith: {
          coll: "scoreboards",
          pipeline: [
            {
              $unwind: {
                path: "$winners.second.departmentNames",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: "eventdetails",
                localField: "eventName",
                foreignField: "eventname",
                as: "eventDetails",
              },
            },
            {
              $unwind: {
                path: "$eventDetails",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: "departmentdetails",
                localField: "winners.second.departmentNames",
                foreignField: "_id",
                as: "secondDepartment",
              },
            },
            {
              $unwind: {
                path: "$secondDepartment",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: {
                  department: "$secondDepartment.departmentname",
                  event: "$eventName",
                  isTeamEvent: { $gt: ["$eventDetails.participants", 1] },
                },
                points: { $max: "$winners.second.points" },
              },
            },
            {
              $group: {
                _id: "$_id.department",
                totalPoints: { $sum: "$points" },
              },
            },
          ],
        },
      },

      {
        $unionWith: {
          coll: "scoreboards",
          pipeline: [
            {
              $unwind: {
                path: "$winners.third.departmentNames",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: "eventdetails",
                localField: "eventName",
                foreignField: "eventname",
                as: "eventDetails",
              },
            },
            {
              $unwind: {
                path: "$eventDetails",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: "departmentdetails",
                localField: "winners.third.departmentNames",
                foreignField: "_id",
                as: "thirdDepartment",
              },
            },
            {
              $unwind: {
                path: "$thirdDepartment",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: {
                  department: "$thirdDepartment.departmentname",
                  event: "$eventName",
                  isTeamEvent: { $gt: ["$eventDetails.participants", 1] },
                },
                points: { $max: "$winners.third.points" },
              },
            },
            {
              $group: {
                _id: "$_id.department",
                totalPoints: { $sum: "$points" },
              },
            },
          ],
        },
      },

      // Final aggregation to sum points per department
      {
        $group: {
          _id: "$_id",
          totalPoints: { $sum: "$totalPoints" },
        },
      },

      // Project final results
      {
        $project: {
          departmentName: "$_id",
          totalPoints: 1,
        },
      },

      // Sort by total points
      { $sort: { totalPoints: -1 } },
    ]);

    console.log("Final Department Rankings:", departmentRankings);

    if (!departmentRankings || departmentRankings.length === 0) {
      return res.status(404).json({ message: "No department rankings found" });
    }

    res.status(200).json({ departmentRankings });
  } catch (error) {
    console.error("Error fetching department rankings:", error);
    res.status(500).json({ error: "Failed to load department rankings." });
  }
};

exports.viewRegistrations = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).send("User not authenticated");
    }

    const loggedInRep = await DeptRep.findById(req.session.user.id).populate(
      "departmentname"
    );
    if (!loggedInRep) {
      return res.status(404).send("Department Representative not found");
    }

    // Fetch all registrations for the logged-in department
    const registrations = await Registration.find({
      department: loggedInRep.departmentname._id,
    })
      .populate("event")
      .populate("className")
      .populate("students");

    // Render the registrations view
    res.render("viewRegistrations", {
      registrations,
      departmentName: loggedInRep.departmentname.departmentname,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
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

/**
 * Fetch structured enrollment requests grouped by Event → Department → Class
 */
exports.getEnrollmentsForAttendance = async (req, res) => {
  try {
    const enrollments = await EnrollmentRequest.find()
      .populate("eventId", "eventname")
      .populate("participants.className", "className")
      .populate("department", "departmentname");

    const structuredData = {};

    enrollments.forEach((enrollment) => {
      const { eventId, department, participants } = enrollment;
      const eventName = eventId.eventname;
      const departmentName = department.departmentname;

      if (!structuredData[eventName]) {
        structuredData[eventName] = {
          eventId: eventId._id,
          eventname: eventName,
          departments: {},
        };
      }

      if (!structuredData[eventName].departments[departmentName]) {
        structuredData[eventName].departments[departmentName] = {};
      }

      participants.forEach((participant) => {
        const className = participant.className.className;

        if (!structuredData[eventName].departments[departmentName][className]) {
          structuredData[eventName].departments[departmentName][className] = [];
        }

        structuredData[eventName].departments[departmentName][className].push({
          participantId: participant._id,
          name: participant.name,
          admno: participant.admno,
          attended: participant.attended, // Track if already marked
        });
      });
    });

    res.json({ success: true, events: Object.values(structuredData) });
  } catch (error) {
    console.error("Error fetching enrollment requests:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Submit attendance for a specific event
 */
exports.submitAttendanceForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { attendance } = req.body;

    if (!attendance || typeof attendance !== "object") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid data format" });
    }

    for (const participantId in attendance) {
      const isPresent = attendance[participantId];

      await EnrollmentRequest.updateOne(
        { eventId: eventId, "participants._id": participantId },
        { $set: { "participants.$.attended": isPresent } }
      );
    }

    res.json({
      success: true,
      message: `Attendance for event '${eventId}' updated successfully!`,
    });
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Generate PDF of attendance for an event
 */
const fs = require("fs");
const path = require("path");

exports.downloadAttendanceAsPDF = async (req, res) => {
  try {
    const { eventId } = req.params;

    const enrollments = await EnrollmentRequest.find({ eventId })
      .populate("eventId", "eventname malayalamname") // Ensure `malayalamname` is stored in DB
      .populate("participants.className", "className")
      .populate("department", "departmentname");

    if (!enrollments.length) {
      return res
        .status(404)
        .json({ success: false, message: "No attendance records found" });
    }

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="attendance_${eventId}.pdf"`
    );

    doc.pipe(res);

    // **Load Custom Malayalam Font**
    const malayalamFontPath = path.join(
      __dirname,
      "../fonts/NotoSansMalayalam-VariableFont_wdth,wght.ttf"
    );
    if (fs.existsSync(malayalamFontPath)) {
      doc.registerFont("malayalam", malayalamFontPath);
    } else {
      console.error(
        "⚠️ Font file not found! Malayalam text may not render correctly."
      );
    }

    // **Event Name (English & Malayalam)**
    const event = enrollments[0].eventId;
    doc
      .fontSize(18)
      .text(event.eventname, { align: "center", underline: true });

    if (event.malayalamname) {
      doc.moveDown(0.5);
      const utf8MalayalamText = Buffer.from(
        event.malayalamname,
        "utf-8"
      ).toString();
      doc
        .font("malayalam")
        .fontSize(16)
        .text(utf8MalayalamText, { align: "center" });
      doc.font("Helvetica"); // Reset to default font after Malayalam text
    }

    doc.moveDown(1.5);

    // **Group Students by Department**
    const departmentMap = new Map();

    enrollments.forEach((enrollment) => {
      const deptName = enrollment.department.departmentname;
      const attendedStudents = enrollment.participants.filter(
        (p) => p.attended
      );

      if (attendedStudents.length > 0) {
        if (!departmentMap.has(deptName)) {
          departmentMap.set(deptName, []);
        }
        departmentMap.get(deptName).push(...attendedStudents);
      }
    });

    // **Render Departments and Students**
    departmentMap.forEach((students, deptName) => {
      doc.fontSize(14).text(`Department: ${deptName}`, { underline: true });
      doc.moveDown(0.5);

      students.forEach((participant, index) => {
        doc
          .fontSize(12)
          .text(
            `${index + 1}. ${participant.name} (Adm No: ${
              participant.admno
            }, Class: ${participant.className.className})`,
            { indent: 20 }
          );
      });

      doc.moveDown(1);
    });

    doc.end();
  } catch (error) {
    console.error("❌ Error generating PDF:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
