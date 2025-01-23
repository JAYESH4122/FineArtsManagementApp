import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/DeptRepManageStudents.css';

const DeptRepManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    admno: '',
    className: '',
  });
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Fetch session user and initialize data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionRes = await axios.get('/deptrep/session');
        const studentsRes = await axios.get('/deptrep/get-students');
        const classesRes = await axios.get(`/deptrep/${sessionRes.data.departmentId}/classes`); // Assuming a route to get classes
        setStudents(studentsRes.data.students);
        setClasses(classesRes.data.classes);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/deptrep/manage-student', formData);
      setSuccess(res.data.message);
      setError(null);
      setStudents(res.data.students);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add student');
      setSuccess(null);
    }
  };

  const handleRemove = async (id) => {
    try {
      const res = await axios.post(`/deptrep/remove-student/${id}`);
      setSuccess(res.data.message);
      setError(null);
      setStudents(res.data.students);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove student');
      setSuccess(null);
    }
  };

  return (
    <div className="manage-students">
      <h1 className="title">Manage Students</h1>
      {success && <p className="success-message">{success}</p>}
      {error && <p className="error-message">{error}</p>}

      <h2>Add Student</h2>
      <form onSubmit={handleSubmit} className="student-form">
        <div className="form-group">
          <label>Username:</label>
          <input type="text" name="username" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="text" name="password" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="name" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Admission no:</label>
          <input type="text" name="admno" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Class:</label>
          <select name="className" onChange={handleChange} required>
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.className}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="submit-button">
          Add Student
        </button>
      </form>

      <h2>Existing Students</h2>
      <table className="students-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Name</th>
            <th>Admission no</th>
            <th>Class</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.username}</td>
              <td>{student.name}</td>
              <td>{student.admno}</td>
              <td>{student.className?.className || 'No Class Assigned'}</td>
              <td>
                <button onClick={() => handleRemove(student._id)} className="remove-button">
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeptRepManageStudents;
