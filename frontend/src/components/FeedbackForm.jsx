import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/FeedbackForm.css';
import { Typography, TextField, Button, Box, Alert } from '@mui/material';
import { FaRegCommentDots, FaPaperPlane } from 'react-icons/fa';
import { motion } from 'framer-motion';

const FeedbackForm = () => {
  const [studentName, setStudentName] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Fetch student data from the server
    axios.get('/student/feedback/form-data')
      .then(response => {
        setStudentName(response.data.studentName);
        setDepartmentName(response.data.departmentName);
      })
      .catch(error => {
        console.error('Error fetching student data:', error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Submit feedback
    axios.post('/student/feedback', { feedback })
      .then(() => {
        setIsSubmitted(true);
      })
      .catch(error => {
        console.error('Error submitting feedback:', error);
      });
  };

  return (
    <div className="feedback-container">
      {isSubmitted ? (
        <motion.div className="thank-you-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Typography variant="h4">Thank You!</Typography>
          <Typography>Your feedback has been submitted successfully.</Typography>
          <motion.a 
            href="/student/dashboard" 
            className="dashboard-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go to Dashboard
          </motion.a>
        </motion.div>
      ) : (
        <motion.div className="feedback-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <FaRegCommentDots className="feedback-icon" />
          <Typography variant="h4" className="feedback-title">Student Feedback</Typography>
          <Typography variant="subtitle1" className="feedback-subtext">
            Your feedback is valuable to us!
          </Typography>

          <Box component="form" onSubmit={handleSubmit} className="feedback-form">
            <TextField
              fullWidth
              label="Student Name"
              value={studentName}
              variant="outlined"
              InputProps={{ readOnly: true }}
              className="form-input"
            />

            <TextField
              fullWidth
              label="Department"
              value={departmentName}
              variant="outlined"
              InputProps={{ readOnly: true }}
              className="form-input"
            />

            <TextField
              fullWidth
              label="Your Feedback"
              multiline
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
              variant="outlined"
              className="form-input"
            />

            <motion.button 
              type="submit" 
              className="submit-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPaperPlane /> Submit Feedback
            </motion.button>
          </Box>
        </motion.div>
      )}
    </div>
  );
};

export default FeedbackForm;
