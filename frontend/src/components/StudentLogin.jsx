import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const backendUrl = import.meta.env.VITE_API_URL;
import '../styles/StudentLogin.css';



function StudentLogin() {
  const navigate = useNavigate(); // useNavigate hook to navigate programmatically

  const [admno, setAdmno] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'admno') setAdmno(value);
    else setPassword(value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make the login request
      const response = await axios.post('/student/login', { admno, password });

      if (response.data.message === 'Login successful') {
        // On success, navigate to student dashboard
        navigate('/student/view-dashboard');
      }
    } catch (err) {
      setError('Invalid credentials or server error!');
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center vh-100">
      <div className="card login-card shadow-lg p-4 rounded-4">
        <div className="text-center mb-4">
          <h2 className="text-success fw-bold">Student Login</h2>
          <p className="text-muted">Enter your credentials to access your dashboard.</p>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
          <label htmlFor="admno" className="form-label">
            User Id
          </label>
          <input
            type="text"
            className="form-control"
            id="admno"
            name="admno"
            value={admno}
            onChange={handleInputChange}
            required
          />
          </div>

          <div className="mb-3 position-relative">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              id="password"
              name="password"
              value={password}
              onChange={handleInputChange}
              required
            />
            <span
              onClick={togglePasswordVisibility}
              className="position-absolute end-0 top-50 translate-middle-y me-3"
              style={{ cursor: 'pointer', color: 'black', fontSize: '1.2rem', zIndex: '10' }}
            >
              {showPassword ? (
                <i className="bi bi-eye-slash"></i>
              ) : (
                <i className="bi bi-eye"></i>
              )}
            </span>
          </div>

          <button type="submit" className="btn btn-success w-100 fw-bold btn-lg mt-3">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default StudentLogin;
