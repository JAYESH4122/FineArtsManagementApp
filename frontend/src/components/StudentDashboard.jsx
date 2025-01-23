import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [studentInfo, setStudentInfo] = useState({});

  // Fetch student data when the component loads
  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const response = await axios.get('/student/dashboard');
        setStudentInfo(response.data);
      } catch (error) {
        console.error('Error fetching student info:', error);
        navigate('/student/login'); // Redirect to login if not authenticated
      }
    };

    fetchStudentInfo();
  }, [navigate]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post('/student/logout');
      navigate('/student/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center text-success">Student Dashboard</h1>
      <p className="text-center text-muted">Welcome, {studentInfo.name}</p>
      <hr />

      <div className="row g-4 mt-4">
        <div className="col-md-4">
          <a href="/student/view-enrollments" className="card text-bg-primary text-white text-center p-4 shadow">
            <h5>View Registrations</h5>
          </a>
        </div>

        <div className="col-md-4">
          <a href="/view-announcements" className="card text-bg-success text-white text-center p-4 shadow">
            <h5>View Announcements</h5>
          </a>
        </div>

        <div className="col-md-4">
          <a href="/view-scoreboard" className="card text-bg-warning text-white text-center p-4 shadow">
            <h5>View Scoreboard</h5>
          </a>
        </div>

        <div className="col-md-4">
          <a href="/student/enroll" className="card text-bg-danger text-white text-center p-4 shadow">
            <h5>Enroll in Events</h5>
          </a>
        </div>

        <div className="col-md-4">
          <a href="/student/add-complaint" className="card text-bg-warning text-white text-center p-4 shadow">
            <h5>Add Complaints</h5>
          </a>
        </div>

        <div className="col-md-4">
          <a href="/student/manage-profile" className="card text-bg-info text-white text-center p-4 shadow">
            <h5>View Profile</h5>
          </a>
        </div>

        <div className="col-md-4">
          <a href="/student/feedback" className="card text-bg-info text-white text-center p-4 shadow">
            <h5>Give Feedback</h5>
          </a>
        </div>
      </div>

      <div className="text-center mt-5">
        <button className="btn btn-danger btn-lg" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard;
