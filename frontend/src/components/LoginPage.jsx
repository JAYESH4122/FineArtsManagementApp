import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/Mary Matha Logo.jpg';


const LoginPage = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 bg-light"
      style={{ margin: 0, padding: 0, width: '100%', height: '100%' }}
    >
      <div className="card shadow-lg p-4 rounded-4" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <img
            src={logo}
            alt="App Logo"
            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            className="mb-3"
          />
          <h2 className="black-text fw-bold">Welcome Back!</h2>
        </div>

        <p className="text-center black-text mb-5">
          Please select your login type to continue.
        </p>

        <div className="d-grid gap-3">
          <Link to="/admin/login" className="btn btn-primary btn-lg" aria-label="Admin Login">
            Admin Login
          </Link>
          <Link to="/deptrep/login" className="btn btn-success btn-lg" aria-label="Department Representative Login">
            Department Rep Login
          </Link>
          <Link to="/student/login" className="btn btn-info btn-lg text-white" aria-label="Student Login">
            Student Login
          </Link>
        </div>

        <footer className="mt-4 text-center black-text"> 
          © 2025 Fine Arts App. All Rights Reserved.
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;
