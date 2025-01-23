import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminManageStudents.css';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    admno: '',
    departmentname: '',
    className: ''
  });
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Fetch departments and students
  useEffect(() => {
    const fetchData = async () => {
      try {
        const depRes = await axios.get('/admin/get-department');
        const studRes = await axios.get('/admin/get-students');
        if (depRes.data.departments) {
          setDepartments(depRes.data.departments);
        } else {
          console.error('Invalid departments data:', depRes.data);
        }
        setStudents(studRes.data.students);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/admin/manage-student', formData);
      setSuccess(res.data.message);
      setError(null);
      setStudents(res.data.students);
    } catch (err) {
      setError(err.response.data.message || 'Failed to add student');
      setSuccess(null);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  

  // Handle input change
  const handleDepartmentChange = (e) => {
    const selectedDepartmentId = e.target.value;
  
    // Find the selected department
    const selectedDepartment = departments.find(dept => dept._id === selectedDepartmentId);
  
    // Update formData and reset classes
    setFormData((prevData) => ({
      ...prevData,
      departmentname: selectedDepartmentId,
      className: '' // Reset selected class when department changes
    }));
  
    // Update classes based on the selected department
    if (selectedDepartment) {
      setClasses(selectedDepartment.classes || []);
    } else {
      setClasses([]);
    }
  };
  
  

  // Remove student
  const handleRemove = async (id) => {
    try {
      const res = await axios.post(`/admin/remove-student/${id}`);
      setSuccess(res.data.message);
      setError(null);
      setStudents(res.data.students);
    } catch (err) {
      setError(err.response.data.message || 'Failed to remove student');
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
  <label>Department Name:</label>
  <select
    name="departmentname"
    id="departmentname"
    className="form-control"
    value={formData.departmentname}
    onChange={handleDepartmentChange}
    required
  >
    <option value="">Select Department</option>
    {departments.map((dept) => {
      console.log('Dropdown Render:', dept);
      return (
        <option key={dept._id} value={dept._id}>
          {dept.departmentname}
        </option>
      );
    })}
  </select>
</div>


        <div className="form-group">
          <label>Class:</label>
            <select name="className" onChange={handleChange} required>
            <option value="">Select Class</option>
              {departments.find((dep) => dep._id === formData.departmentname)?.classes?.map((cls) => (
                  <option key={cls._id} value={cls._id}>{cls.className}</option>
            ))}
            </select>
        </div>
        <button type="submit" className="submit-button">Add Student</button>
      </form>

      <h2>Existing Students</h2>
      <table className="students-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Name</th>
            <th>Admission no</th>
            <th>Department</th>
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
              <td>{student.departmentname?.departmentname || ''}</td>
              <td>{student.className?.className || 'No Class Assigned'}</td>
              <td>
                <button
                  onClick={() => handleRemove(student._id)}
                  className="remove-button"
                >
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

export default ManageStudents;
