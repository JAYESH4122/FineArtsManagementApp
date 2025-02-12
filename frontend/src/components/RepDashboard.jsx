import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSignOutAlt } from 'react-icons/fa';  // For Logout Icon
import '../styles/RepDashboard.css';

const RepDashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // React Router v6 for navigation

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/deptrep/session', {
          withCredentials: true, // Ensure cookies are included for session
        });

        if (response.status === 200) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/deptrep/login'); // Redirect to login if not logged in
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const response = await axios.post('/deptrep/logout', null, {
        withCredentials: true,
      });

      if (response.status === 200) {
        navigate('/deptrep/login');
      } else {
        console.error('Logout failed');
        alert('Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      alert('An error occurred during logout.');
    }
  };

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-3">
        <div className="container">
          <a className="navbar-brand" href="/deptrep/dashboard">
            Representative Dashboard
          </a>
          <h1 className="text-center mb-4">Welcome, {user?.username}</h1>
          <p className="text-center mb-4">Department: {user?.departmentName}</p>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="dashboard-main">

        <div className="dashboard-grid">
          {/* Manage Students */}
          <div className="dashboard-card">
            <a href="/deptrep/manage-student">
              <div className="card-icon"><i className="fas fa-user-graduate fa-3x"></i></div>
              <h3>Manage Students</h3>
            </a>
          </div>

          {/* Add Students to Events */}
          <div className="dashboard-card">
            <a href="">
              <div className="card-icon"><i className="fas fa-calendar-plus fa-3x"></i></div>
              <h3>Add Students to Events</h3>
            </a>
          </div>

          {/* View Department-wise Rankings */}
          <div className="dashboard-card">
            <a href="/deptrep/view-departmentwise-rankings">
              <div className="card-icon"><i className="fas fa-list-ol fa-3x"></i></div>
              <h3>View Department-wise Rankings</h3>
            </a>
          </div>

          {/* View Registrations */}
          <div className="dashboard-card">
            <a href="/deptrep/view-registrations">
              <div className="card-icon"><i className="fas fa-users fa-3x"></i></div>
              <h3>View Registrations</h3>
            </a>
          </div>

          {/* View Announcements */}
          <div className="dashboard-card">
            <a href="/deptrep/view-announcements">
              <div className="card-icon"><i className="fas fa-bullhorn fa-3x"></i></div>
              <h3>View Announcements</h3>
            </a>
          </div>

          {/* View Scoreboard */}
          <div className="dashboard-card">
            <a href="/deptrep/view-scoreboard">
              <div className="card-icon"><i className="fas fa-trophy fa-3x"></i></div>
              <h3>View Scoreboard</h3>
            </a>
          </div>

          {/* View Complaints */}
          <div className="dashboard-card">
            <a href="/deptrep/reply-complaints">
              <div className="card-icon"><i className="fas fa-comment fa-3x"></i></div>
              <h3>View Complaints</h3>
            </a>
          </div>
        </div>

        <div className="text-center mt-4">
          <button className="btn btn-danger btn-lg" onClick={handleLogout}>
            <FaSignOutAlt className="logout-icon" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default RepDashboard;
