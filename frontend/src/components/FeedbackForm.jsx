import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
        setDepartmentName(response.data.departmentName); // Set department name from the response
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

  if (isSubmitted) {
    return (
      <div className="container">
        <div className="card">
          <h1>Thank You!</h1>
          <p>Your feedback has been submitted successfully.</p>
          <a href="/student/dashboard" className="btn">Go to Dashboard</a>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Feedback Form</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="studentName">Student Name</label>
        <input
          type="text"
          id="studentName"
          value={studentName}
          readOnly
        />

        <label htmlFor="departmentName">Department</label>
        <input
          type="text"
          id="departmentName"
          value={departmentName}
          readOnly
        />

        <label htmlFor="feedback">Your Feedback</label>
        <textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          required
        ></textarea>

        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
};

export default FeedbackForm;
