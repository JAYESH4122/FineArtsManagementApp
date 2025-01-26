import '../styles/StudentProfile.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentProfile = () => {
    const [student, setStudent] = useState({});
    const [editingField, setEditingField] = useState(null); // Track which field is being edited
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
            .then(response => {
                setStudent(prev => ({ ...prev, [editingField]: updatedValue }));
                setEditingField(null);
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="profile-container">
            <h1 className="profile-title">Student Profile</h1>
            <div className="profile-info">
    <p><strong>Name:</strong> {student.name}</p>
    <p><strong>Department:</strong> {student.departmentname?.departmentname || 'N/A'}</p>
    <p><strong>Class:</strong> {student.className?.className || 'N/A'}</p>
    <p><strong>Roll No:</strong> {student.rollno}</p>
    <p><strong>Admission No:</strong> {student.admno}</p>
    <p><strong>Phone Number:</strong>
        {editingField === 'phno' ? (
            <input
                type="text"
                value={updatedValue}
                onChange={(e) => setUpdatedValue(e.target.value)}
                className="edit-input"
            />
        ) : (
            student.phno
        )}
        <button
            className="edit-btn"
            onClick={() => (editingField === 'phno' ? handleSave() : handleEdit('phno'))}
        >
            {editingField === 'phno' ? 'Save' : 'Edit'}
        </button>
    </p>
    <p>
        <strong>Gmail:</strong>
        {editingField === 'gmail' ? (
            <input
                type="email"
                value={updatedValue}
                onChange={(e) => setUpdatedValue(e.target.value)}
                className="edit-input"
            />
        ) : (
            student.gmail || 'N/A'
        )}
        <button
            className="edit-btn"
            onClick={() => (editingField === 'gmail' ? handleSave() : handleEdit('gmail'))}
        >
            {editingField === 'gmail' ? 'Save' : 'Edit'}
        </button>
    </p>
</div>

        </div>
    );
};

export default StudentProfile;
