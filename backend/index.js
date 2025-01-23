const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Replace with the frontend's origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Define allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Define allowed headers
}));

// Session setup
app.use(session({
  secret: 'jayesh',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: 'mongodb://127.0.0.1:27017/project',
  }),
  cookie: {
    secure: false, // Set to true in production
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  },
}));

// MongoDB connection
mongoose
  .connect('mongodb://127.0.0.1:27017/project')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Routes for your API
const adminRoutes = require('./routes/adminRoute');
app.use('/admin', adminRoutes);

const deptrepRoutes = require('./routes/deptrepRoute');
app.use('/deptrep', deptrepRoutes);

const studentRoutes = require('./routes/studentRoute');
app.use('/student', studentRoutes);

// ✅ Serve static files from React's build folder
app.use(express.static(path.join(__dirname, '../frontend/build')));

// ✅ Catch-all handler to serve React's index.html for any route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
