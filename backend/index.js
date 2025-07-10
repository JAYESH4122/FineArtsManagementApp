const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const cookieParser = require('cookie-parser')

require("dotenv").config();

const mongoUrl = process.env.MONGO_URI;
const frontendOrigin =
  process.env.NODE_ENV === "production"
    ? "https://fine-arts-management-87t8je13m-jayesh-pjs-projects.vercel.app/"
    : "http://localhost:5173";
const sessionSecret = process.env.SESSION_SECRET;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: frontendOrigin,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

mongoose
  .connect(mongoUrl)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const adminRoutes = require("./routes/adminRoute");
app.use("/admin", adminRoutes);

const deptrepRoutes = require("./routes/deptrepRoute");
app.use("/deptrep", deptrepRoutes);

const studentRoutes = require("./routes/studentRoute");
app.use("/student", studentRoutes);

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
