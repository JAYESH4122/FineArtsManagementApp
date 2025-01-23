import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/StudentLogin.css';

function StudentLogin() {
  const navigate = useNavigate(); // useNavigate hook to navigate programmatically

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') setUsername(value);
    else setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make the login request
      const response = await axios.post('/student/login', { username, password });

      if (response.data.message === 'Login successful') {
        // On success, navigate to student dashboard
        navigate('/student/dashboard');
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
            <label htmlFor="username" className="form-label">
              User Id
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={username}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={password}
              onChange={handleInputChange}
              required
            />
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
