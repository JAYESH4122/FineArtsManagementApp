import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/StudentComplaintPage.css';
import { TextField, MenuItem, Button, Typography, Grid, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaPaperPlane, FaClipboardList } from "react-icons/fa";

const subjects = ["Appeal for an event", "Register a group event", "Other"];

const StudentComplaintPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [departmentRepName, setDepartmentRepName] = useState('');
  const [form, setForm] = useState({ subject: '', description: '' });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data } = await axios.get('/student/complaints');
      setComplaints(data.complaints);
      setDepartmentRepName(data.departmentRepName);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/student/complaints', form);
      fetchComplaints();
      setForm({ subject: '', description: '' });
    } catch (error) {
      console.error('Error submitting complaint:', error);
    }
  };

  return (
    <div className="complaint-container">
      {/* Page Title */}
      <div className="complaint-header">
        <FaExclamationTriangle className="complaint-icon" />
        <Typography variant="h4" className="complaint-title">Student Complaints</Typography>
        <Typography variant="subtitle1" className="complaint-subtext">
          Complaints will be sent to your Association Secretary: <strong>{departmentRepName}</strong>
        </Typography>
      </div>

      {/* Complaint Form */}
      <motion.form 
        className="complaint-form"
        onSubmit={handleSubmit}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <TextField
          fullWidth
          select
          label="Subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          required
          className="form-input"
        >
          {subjects.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Description"
          multiline
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
          className="form-input"
        />

        <motion.button 
          type="submit" 
          className="submit-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPaperPlane /> Submit Complaint
        </motion.button>
      </motion.form>

      {/* Complaints Section */}
      <Typography variant="h5" className="complaint-list-title">
        <FaClipboardList /> Your Complaints
      </Typography>
      {complaints.length === 0 ? (
        <Typography variant="body1" className="no-complaints">
          No complaints found.
        </Typography>
      ) : (
        <Grid container spacing={2} className="complaint-grid">
          {complaints.map((complaint) => (
            <Grid item xs={12} sm={6} key={complaint._id}>
              <motion.div className="complaint-card" whileHover={{ scale: 1.02 }}>
                <Typography variant="h6"><strong>Subject:</strong> {complaint.subject}</Typography>
                <Typography variant="body2"><strong>Description:</strong> {complaint.complaintText}</Typography>
                <Typography variant="caption" className="complaint-date">
                  Submitted on: {new Date(complaint.createdAt).toLocaleDateString()}
                </Typography>

                {complaint.reply ? (
                  <Alert severity="success" className="complaint-reply">
                    <strong>Reply:</strong> {complaint.reply} <br />
                    <small>Replied on: {new Date(complaint.repliedAt).toLocaleDateString()}</small>
                  </Alert>
                ) : (
                  <Typography variant="body2" className="no-reply">Not replied yet</Typography>
                )}
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default StudentComplaintPage;
