import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Typography, Box, Button, Avatar, Grid } from "@mui/material";
import { FaSignOutAlt, FaRegEdit, FaBullhorn, FaTrophy, FaUniversity, FaPen, FaCommentDots, FaUserCircle, FaPaintBrush } from "react-icons/fa";
import { motion } from 'framer-motion';
import '../styles/StudentDashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [studentInfo, setStudentInfo] = useState({});

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const response = await axios.get('/student/dashboard');
        setStudentInfo(response.data);
      } catch (error) {
        console.error('Error fetching student info:', error);
        navigate('/student/login');
      }
    };

    fetchStudentInfo();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post('/student/logout');
      navigate('/student/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Fixed Header */}
      <header className="dashboard-header">
        <Box display="flex" alignItems="center" justifyContent="center" className="header-content">
          <Avatar src="https://i.pravatar.cc/300" className="profile-avatar" />
          <Box ml={2} textAlign="center">
            <Typography variant="h6" className="profile-name">
              Welcome, {studentInfo.name}
            </Typography>
            <Typography variant="body2" className="profile-subtext">
              Fine Arts Festival 2025
            </Typography>
          </Box>
        </Box>
      </header>
  
      {/* Main Dashboard Content */}
      <main className="dashboard-main">
        <Grid container spacing={3} className="dashboard-grid">
          {[
            { icon: <FaRegEdit />, text: "View Registrations", path: "/student/view-registrations" },
            { icon: <FaBullhorn />, text: "View Announcements", path: "/student/view-announcements" },
            { icon: <FaTrophy />, text: "View Scoreboard", path: "/student/view-scoreboard" },
            { icon: <FaUniversity />, text: "Department-wise Rankings", path: "/student/view-departmentwise-rankings" },
            { icon: <FaPen />, text: "Enroll in Events", path: "/student/enroll" },
            { icon: <FaCommentDots />, text: "Add Complaints", path: "/student/view-complaints" },
            { icon: <FaUserCircle />, text: "View Profile", path: "/student/manage-profile" },
            { icon: <FaPaintBrush />, text: "Give Feedback", path: "/student/view-feedback" }
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <motion.div
                className="dashboard-card"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(item.path)}
              >
                <div className="card-icon">{item.icon}</div>
                <h3>{item.text}</h3>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </main>
  
      {/* Fixed Logout Button */}
      <div className="dashboard-logout">
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button variant="contained" className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt className="logout-icon" /> Logout
          </Button>
        </motion.div>
      </div>
    </div>
  );  
};

export default StudentDashboard;