import '../styles/StudentProfile.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, TextField, Button, Box, Avatar } from '@mui/material';
import { FaUserCircle, FaEdit, FaSave } from 'react-icons/fa';
import { motion } from 'framer-motion';

const StudentProfile = () => {
    const [student, setStudent] = useState({});
    const [editingField, setEditingField] = useState(null);
    const [updatedValue, setUpdatedValue] = useState('');

    useEffect(() => {
        axios.get('/student/profile')
            .then(response => {
                setStudent(response.data.student);
            })
            .catch(err => console.error(err));
    }, []);

    const handleEdit = (field) => {
        setEditingField(field);
        setUpdatedValue(student[field]);
    };

    const handleSave = () => {
        const updatedData = { [editingField]: updatedValue };

        axios.put('/student/profile', updatedData)
            .then(() => {
                setStudent(prev => ({ ...prev, [editingField]: updatedValue }));
                setEditingField(null);
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="profile-container">
            {/* Profile Header */}
            <div className="profile-header">
                <Avatar className="profile-avatar">
                    <FaUserCircle className="avatar-icon" />
                </Avatar>
                <Typography variant="h4" className="profile-title">Student Profile</Typography>
            </div>

            {/* Profile Details */}
            <Box className="profile-card">
                <Typography variant="h6" className="profile-label">Name:</Typography>
                <Typography className="profile-text">{student.name}</Typography>

                <Typography variant="h6" className="profile-label">Department:</Typography>
                <Typography className="profile-text">{student.departmentname?.departmentname || 'N/A'}</Typography>

                <Typography variant="h6" className="profile-label">Class:</Typography>
                <Typography className="profile-text">{student.className?.className || 'N/A'}</Typography>

                <Typography variant="h6" className="profile-label">Roll No:</Typography>
                <Typography className="profile-text">{student.rollno}</Typography>

                <Typography variant="h6" className="profile-label">Admission No:</Typography>
                <Typography className="profile-text">{student.admno}</Typography>

                {/* Editable Fields */}
                <Box className="editable-field">
                    <Typography variant="h6" className="profile-label">Phone Number:</Typography>
                    {editingField === 'phno' ? (
                        <TextField
                            variant="outlined"
                            size="small"
                            value={updatedValue}
                            onChange={(e) => setUpdatedValue(e.target.value)}
                            className="edit-input"
                        />
                    ) : (
                        <Typography className="profile-text">{student.phno}</Typography>
                    )}
                    <motion.button 
                        className="edit-btn"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => (editingField === 'phno' ? handleSave() : handleEdit('phno'))}
                    >
                        {editingField === 'phno' ? <FaSave /> : <FaEdit />}
                    </motion.button>
                </Box>

                <Box className="editable-field">
                    <Typography variant="h6" className="profile-label">Gmail:</Typography>
                    {editingField === 'gmail' ? (
                        <TextField
                            variant="outlined"
                            size="small"
                            type="email"
                            value={updatedValue}
                            onChange={(e) => setUpdatedValue(e.target.value)}
                            className="edit-input"
                        />
                    ) : (
                        <Typography className="profile-text">{student.gmail || 'N/A'}</Typography>
                    )}
                    <motion.button 
                        className="edit-btn"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => (editingField === 'gmail' ? handleSave() : handleEdit('gmail'))}
                    >
                        {editingField === 'gmail' ? <FaSave /> : <FaEdit />}
                    </motion.button>
                </Box>
            </Box>
        </div>
    );
};

export default StudentProfile;
