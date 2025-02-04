import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminManageStudents.css';
import { Typography, TextField, Button, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert } from '@mui/material';
import { FaUserPlus, FaTrashAlt, FaUsers } from "react-icons/fa";
import { motion } from 'framer-motion';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const depRes = await axios.get('/admin/get-department');
        const studRes = await axios.get('/admin/get-students');
        if (depRes.data.departments) {
          setDepartments(depRes.data.departments);
        }
        setStudents(studRes.data.students);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/admin/manage-student', formData);
      setSuccess(res.data.message);
      setError(null);
      setStudents(res.data.students);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add student');
      setSuccess(null);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRemove = async (id) => {
    try {
      const res = await axios.post(`/admin/remove-student/${id}`);
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
      {/* Page Header */}
      <div className="students-header">
        <FaUsers className="header-icon" />
        <Typography variant="h4" className="header-title">Manage Students</Typography>
      </div>

      {/* Alerts */}
      {success && <Alert severity="success" className="alert">{success}</Alert>}
      {error && <Alert severity="error" className="alert">{error}</Alert>}

      {/* Add Student Form */}
      <motion.div className="student-form-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Typography variant="h5" className="form-title">
          <FaUserPlus /> Add Student
        </Typography>
        <form onSubmit={handleSubmit} className="student-form">
          <TextField fullWidth label="Username" name="username" onChange={handleChange} required className="form-input" />
          <TextField fullWidth label="Password" name="password" onChange={handleChange} required className="form-input" />
          <TextField fullWidth label="Name" name="name" onChange={handleChange} required className="form-input" />
          <TextField fullWidth label="Admission No" name="admno" onChange={handleChange} required className="form-input" />
          
          <Select fullWidth name="departmentname" value={formData.departmentname} onChange={handleChange} required className="form-input">
            <MenuItem value="">Select Department</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept._id} value={dept._id}>{dept.departmentname}</MenuItem>
            ))}
          </Select>

          <Select fullWidth name="className" value={formData.className} onChange={handleChange} required className="form-input">
            <MenuItem value="">Select Class</MenuItem>
            {departments.find(dep => dep._id === formData.departmentname)?.classes?.map(cls => (
              <MenuItem key={cls._id} value={cls._id}>{cls.className}</MenuItem>
            ))}
          </Select>

          <motion.button type="submit" className="submit-button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Add Student
          </motion.button>
        </form>
      </motion.div>

      {/* Existing Students Table */}
      <Typography variant="h5" className="students-table-title">Existing Students</Typography>
      <TableContainer component={Paper} className="students-table-container">
        <Table>
          <TableHead>
            <TableRow className="table-header">
              <TableCell>Username</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Admission No</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student._id}>
                <TableCell>{student.username}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.admno}</TableCell>
                <TableCell>{student.departmentname?.departmentname || ''}</TableCell>
                <TableCell>{student.className?.className || 'No Class Assigned'}</TableCell>
                <TableCell>
                  <motion.button 
                    className="remove-button" 
                    onClick={() => handleRemove(student._id)}
                    whileHover={{ scale: 1.05 }}
                  >
                    <FaTrashAlt /> Remove
                  </motion.button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ManageStudents;
