import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/RepDashboard.css';

const RepDashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // React Router v6 for navigation

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/deptrep/session', {
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
      const response = await axios.post('http://localhost:4000/deptrep/logout', null, {
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
    <div className="container mt-5">
      <h1 className="text-center mb-4">Representative Dashboard</h1>

      {user && (
        <div>
          <h3 className="text-center mb-4">Welcome, {user.username}</h3>
          <p className="text-center mb-4">Department: {user.departmentName}</p>

          <div className="row g-4">
            <div className="col-md-4">
              <a href="/deptrep/manage-student" className="card text-bg-danger text-white text-center p-4 shadow-lg">
                <h5>Manage Students</h5>
              </a>
            </div>

            <div className="col-md-4">
              <a href="/deptrep/register-events" className="card text-bg-primary text-white text-center p-4 shadow-lg">
                <h5>Add Students to Events</h5>
              </a>
            </div>

            <div className="col-md-4">
              <a href="/deptrep/view-department-rankings" className="card text-bg-warning text-white text-center p-4 shadow-lg">
                <h5>View Department-wise Rankings</h5>
              </a>
            </div>

            <div className="col-md-4">
              <a href="/deptrep/registrations" className="card text-bg-primary text-white text-center p-4 shadow-lg">
                <h5>View Registrations</h5>
              </a>
            </div>

            <div className="col-md-4">
              <a href="/deptrep/view-announcements" className="card text-bg-success text-white text-center p-4 shadow-lg">
                <h5>View Announcements</h5>
              </a>
            </div>

            <div className="col-md-4">
              <a href="/deptrep/view-scoreboard" className="card text-bg-warning text-white text-center p-4 shadow-lg">
                <h5>View Scoreboard</h5>
              </a>
            </div>

            <div className="col-md-4">
              <a href="/deptrep/view-complaints" className="card text-bg-warning text-white text-center p-4 shadow-lg">
                <h5>View Complaints</h5>
              </a>
            </div>

            <div className="col-md-12 text-center mt-4">
              <button className="btn btn-danger btn-lg" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepDashboard;
