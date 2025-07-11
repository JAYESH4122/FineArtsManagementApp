import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSignOutAlt } from 'react-icons/fa';
import '../styles/AdminDashboard.css';

const backendUrl = process.env.REACT_APP_API_URL;

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/admin/logout');
      navigate('/admin/login');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-3 ">
        <div className="container">
          <Link className="navbar-brand">
            Admin Panel
          </Link>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="dashboard-main">

        <div className="dashboard-grid">
          {/* Post Announcements */}
          <div className="dashboard-card">
            <Link to="/admin/add-announcement">
              <div className="card-icon"><i className="fas fa-bullhorn fa-3x"></i></div>
              <h3>Post Announcements</h3>
            </Link>
          </div>

          {/* View Announcements */}
          <div className="dashboard-card">
            <Link to="/admin/view-announcements">
              <div className="card-icon"><i className="fas fa-eye fa-3x"></i></div>
              <h3>View Announcements</h3>
            </Link>
          </div>

          {/* Add Scoreboard */}
          <div className="dashboard-card">
            <Link to="/admin/add-scoreboard">
              <div className="card-icon"><i className="fas fa-chart-line fa-3x"></i></div>
              <h3>Add Scoreboard</h3>
            </Link>
          </div>

                    {/* View Scoreboard */}
          <div className="dashboard-card">
            <Link to="/admin/mark-atendence">
              <div className="card-icon"><i className="fas fa-trophy fa-3x"></i></div>
              <h3>Attendence Mark</h3>
            </Link>
          </div>

          {/* View Scoreboard */}
          <div className="dashboard-card">
            <Link to="/admin/view-scoreboard">
              <div className="card-icon"><i className="fas fa-trophy fa-3x"></i></div>
              <h3>View Scoreboard</h3>
            </Link>
          </div>

          {/* View Department-wise Rankings */}
          <div className="dashboard-card">
            <Link to="/admin/view-departmentwise-rankings">
              <div className="card-icon"><i className="fas fa-list-ol fa-3x"></i></div>
              <h3>View Department-wise Rankings</h3>
            </Link>
          </div>

          {/* Add New Event */}
          <div className="dashboard-card">
            <Link to="/admin/add-event">
              <div className="card-icon"><i className="fas fa-calendar-plus fa-3x"></i></div>
              <h3>Add New Event</h3>
            </Link>
          </div>

          {/* View Registrations */}
          <div className="dashboard-card">
            <Link to="/admin/view-registrations">
              <div className="card-icon"><i className="fas fa-users fa-3x"></i></div>
              <h3>View Registrations</h3>
            </Link>
          </div>

          {/* Manage Representatives */}
          <div className="dashboard-card">
            <Link to="/admin/manage-representatives">
              <div className="card-icon"><i className="fas fa-user-tie fa-3x"></i></div>
              <h3>Manage Representatives</h3>
            </Link>
          </div>

          {/* Manage Students */}
          {/* <div className="dashboard-card">
            <Link to="/admin/manage-student">
              <div className="card-icon"><i className="fas fa-user-graduate fa-3x"></i></div>
              <h3>Manage Students</h3>
            </Link>
          </div> */}

          {/* View Feedback */}
          <div className="dashboard-card">
            <Link to="/admin/feedback">
              <div className="card-icon"><i className="fas fa-comments fa-3x"></i></div>
              <h3>View Feedback</h3>
            </Link>
          </div>
        </div>
      </div>

      {/* Fixed Logout Button */}
      <div className="fixed-logout">
        <button className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt className="logout-icon" /> Logout
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
