const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');

require('dotenv').config();

const mongoUrl = process.env.MONGO_URI;
const frontendOrigin = process.env.FRONTEND_ORIGIN;
const sessionSecret = process.env.SESSION_SECRET;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({
  origin: frontendOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

mongoose.connect(mongoUrl)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));
  
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
