import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppBar, Toolbar, Typography, Box, Grid, Button } from "@mui/material";
import 'bootstrap/dist/css/bootstrap.min.css';
const backendUrl = process.env.REACT_APP_API_URL;
import '../styles/StudentDashboard.css';
import { FaClipboardList, FaBullhorn, FaTrophy, FaUniversity, FaRegEdit, FaCommentDots, FaUserCircle, FaPen, FaPaintBrush } from 'react-icons/fa';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [studentInfo, setStudentInfo] = useState({});

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const response = await axios.get(`${backendUrl}/student/dashboard`);
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
      await axios.post(`${backendUrl}/student/logout`);
      navigate('/student/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="dashboard-container">
      {/* AppBar Header */}
      <AppBar position="static" sx={{ background: "linear-gradient(135deg, #1e293b, #0ea5e9)", padding: "10px 40px", borderRadius: "16px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJCVDYYtTmG7b32A4HOqDRC8YTaoeIEOfvjQ&s" alt="College Logo" style={{ width: 50, height: 50, marginRight: 16 }} />
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "white" }}>Fine Arts Festival 2025</Typography>
          </Box>
          <Box sx={{ textAlign: "center", flex: 1, minWidth: "250px" }}>
            <Typography variant="h6" sx={{ color: "#dbeafe" }}>Welcome, {studentInfo.name}</Typography>
            <Typography variant="body2" sx={{ color: "#dbeafe" }}>Step into the vibrant world of Fine Arts!</Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Dashboard Content */}
      <main className="dashboard-main">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <div className="dashboard-card" onClick={() => navigate('/student/view-registrations')}>
              <FaRegEdit className="card-icon" />
              <h3>View Registrations</h3>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <div className="dashboard-card" onClick={() => navigate('/student/view-announcements')}>
              <FaBullhorn className="card-icon" />
              <h3>View Announcements</h3>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <div className="dashboard-card" onClick={() => navigate('/student/view-scoreboard')}>
              <FaTrophy className="card-icon" />
              <h3>View Scoreboard</h3>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <div className="dashboard-card" onClick={() => navigate('/student/view-departmentwise-rankings')}>
              <FaUniversity className="card-icon" />
              <h3>View Department-wise Rankings</h3>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <div className="dashboard-card" onClick={() => navigate('/student/enroll')}>
              <FaPen className="card-icon" />
              <h3>Enroll in Events</h3>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <div className="dashboard-card" onClick={() => navigate('/student/view-complaints')}>
              <FaCommentDots className="card-icon" />
              <h3>Add Complaints</h3>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <div className="dashboard-card" onClick={() => navigate('/student/manage-profile')}>
              <FaUserCircle className="card-icon" />
              <h3>View Profile</h3>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <div className="dashboard-card" onClick={() => navigate('/student/view-feedback')}>
              <FaPaintBrush className="card-icon" />
              <h3>Give Feedback</h3>
            </div>
          </Grid>
        </Grid>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="footer-actions">
          <Button variant="contained" sx={{ backgroundColor: '#0ea5e9', '&:hover': { backgroundColor: '#1e293b' } }} onClick={handleLogout}>Logout</Button>
        </div>
      </footer>
    </div>
  );
};

export default StudentDashboard;
