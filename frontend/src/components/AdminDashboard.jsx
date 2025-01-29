import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
const backendUrl = process.env.REACT_APP_API_URL;
import '../styles/AdminDashboard.css'; // Create a custom CSS file if needed

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = async () => {
    try {
      await axios.post(`${backendUrl}/admin/logout`);
      navigate('/admin/login'); // Redirect to login page after logout
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-3">
        <div className="container">
          <Link className="navbar-brand" to="/admin/dashboard">
            Admin Panel
          </Link>
          <button className="btn btn-outline-light ms-auto" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container mt-5">
        <h1 className="text-center mb-4">Admin Dashboard</h1>

        <div className="row g-4">

        {/* Post Announcements */}
        <div className="col-md-4">
          <Link to="/admin/add-announcement" className="card dashboard-card text-bg-primary shadow">
            <i className="fas fa-bullhorn fa-3x mb-3"></i>
            <h5>Post Announcements</h5>
          </Link>
        </div>

          {/* View Announcements */}
          <div className="col-md-4">
            <Link to="/admin/view-announcements" className="card dashboard-card text-bg-success shadow">
              <i className="fas fa-eye fa-3x mb-3"></i>
              <h5>View Announcements</h5>
            </Link>
          </div>

          {/* Add Scoreboard */}
          <div className="col-md-4">
            <Link to="/admin/add-scoreboard" className="card dashboard-card text-bg-info shadow">
              <i className="fas fa-chart-line fa-3x mb-3"></i>
              <h5>Add Scoreboard</h5>
            </Link>
          </div>

          {/* View Scoreboard */}
          <div className="col-md-4">
            <Link to="/admin/view-scoreboard" className="card dashboard-card text-bg-warning shadow">
              <i className="fas fa-trophy fa-3x mb-3"></i>
              <h5>View Scoreboard</h5>
            </Link>
          </div>

          {/* View Department-wise Rankings */}
          <div className="col-md-4">
            <Link to="/admin/view-departmentwise-rankings" className="card dashboard-card text-bg-danger shadow">
              <i className="fas fa-list-ol fa-3x mb-3"></i>
              <h5>View Department-wise Rankings</h5>
            </Link>
          </div>

          {/* Add New Event */}
          <div className="col-md-4">
            <Link to="/admin/add-event" className="card dashboard-card text-bg-info shadow">
              <i className="fas fa-calendar-plus fa-3x mb-3"></i>
              <h5>Add New Event</h5>
            </Link>
          </div>

          {/* View Registrations */}
          <div className="col-md-4">
            <Link to="/admin/view-registrations" className="card dashboard-card text-bg-primary shadow">
              <i className="fas fa-users fa-3x mb-3"></i>
              <h5>View Registrations</h5>
            </Link>
          </div>

          {/* Manage Representatives */}
          <div className="col-md-4">
            <Link to="/admin/manage-representatives" className="card dashboard-card text-bg-secondary shadow">
              <i className="fas fa-user-tie fa-3x mb-3"></i>
              <h5>Manage Representatives</h5>
            </Link>
          </div>

          {/* Manage Students */}
          <div className="col-md-4">
            <Link to="/admin/manage-student" className="card dashboard-card text-bg-danger shadow">
              <i className="fas fa-user-graduate fa-3x mb-3"></i>
              <h5>Manage Students</h5>
            </Link>
          </div>

          {/* View Feedback */}
          <div className="col-md-4">
            <Link to="/admin/feedback" className="card dashboard-card text-bg-primary shadow">
              <i className="fas fa-comments fa-3x mb-3"></i>
              <h5>View Feedback</h5>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
