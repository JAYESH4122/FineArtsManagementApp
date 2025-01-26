import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/StudentDashboard.css'; // Import the custom CSS file

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
      <h1 className="dashboard-title">Student Dashboard</h1>
      <p className="dashboard-subtitle">Welcome, {studentInfo.name || "Student"}</p>
      <hr className="dashboard-divider" />

      <div className="row g-4 mt-4">
        {[
          { href: '/student/view-registrations', title: 'View Registrations', class: 'primary' },
          { href: '/student/view-announcements', title: 'View Announcements', class: 'success' },
          { href: '/student/view-scoreboard', title: 'View Scoreboard', class: 'warning' },
          { href: '/student/view-departmentwise-rankings', title: 'View Department-wise Rankings', class: 'secondary' },
          { href: '/student/enroll', title: 'Enroll in Events', class: 'danger' },
          { href: '/student/view-complaints', title: 'Add Complaints', class: 'warning' },
          { href: '/student/manage-profile', title: 'View Profile', class: 'info' },
          { href: '/student/view-feedback', title: 'Give Feedback', class: 'dark' },
        ].map((card, index) => (
          <div className="col-md-4" key={index}>
            <a href={card.href} className={`card custom-card bg-${card.class} text-white text-center`}>
              <h5>{card.title}</h5>
            </a>
          </div>
        ))}
      </div>

      <div className="text-center mt-5">
        <button className="btn btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard;
