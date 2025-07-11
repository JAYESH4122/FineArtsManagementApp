import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/DeptRepLogin.css';
import { useNavigate } from 'react-router-dom';

const DeptRepLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [departments, setDepartments] = useState([]); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true); 
        const response = await axios.get('/deptrep/login'); 
        

        console.log('Fetched departments:', response.data);

        if (Array.isArray(response.data)) {
          setDepartments(response.data);
        } else {
          setError('Invalid department data received');
        }
      } catch (err) {
        console.error('Error fetching departments:', err);
        setError('Failed to load departments');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') setUsername(value);
    if (name === 'password') setPassword(value);
    if (name === 'department') setDepartment(value);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/deptrep/login', { username, password, department });

      if (response.status === 200) {
        console.log('Logged in successfully:', response.data);
        navigate('/deptrep/view-dashboard');
      } else {
        setError(response.data.error || 'Invalid credentials or server error!');
      }
    } catch (err) {
      setError('Invalid credentials or server error!',err);
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center vh-100">
      <div className="card login-card shadow-lg p-4 rounded-4">
        <div className="text-center mb-4">
          <h2 className="text-warning fw-bold">Department Representative Login</h2>
          <p className="text-muted">Please enter your credentials to access your department's tasks.</p>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">User Id</label>
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
            <label htmlFor="password" className="form-label">Password</label>
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

          <div className="mb-3">
            <label htmlFor="department" className="form-label">Department</label>
            {/* Render loading message if still loading departments */}
            {loading ? (
              <select id="department" name="department" className="form-control" disabled>
                <option>Loading departments...</option>
              </select>
            ) : (
              <select
                id="department"
                name="department"
                className="form-control"
                value={department}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Department</option>
                {departments && departments.length > 0 ? (
                  departments.map(department => (
                    <option key={department._id} value={department._id}>
                      {department.departmentname}
                    </option>
                  ))
                ) : (
                  <option>No departments available</option>
                )}
              </select>
            )}
          </div>

          <button type="submit" className="btn btn-warning w-100 fw-bold btn-lg mt-3">
            Login
          </button>
        </form>

        <footer className="mt-4 text-center text-muted"></footer>
      </div>
    </div>
  );
};

export default DeptRepLogin;
