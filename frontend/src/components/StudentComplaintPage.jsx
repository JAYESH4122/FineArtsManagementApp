import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/StudentComplaintPage.css';
import { Container, TextField, MenuItem, Button, Card, CardContent, Typography, Grid, Alert, Box } from '@mui/material';

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
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Student Complaints
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" align="center" gutterBottom>
        Complaints will be sent to : <br /> Your Association Secretary: <strong>{departmentRepName}</strong>
      </Typography>

      {/* Complaint Form */}
      <Box component="form" onSubmit={handleSubmit} sx={{ backgroundColor: '#f9f9f9', p: 3, borderRadius: 2, boxShadow: 2 }}>
        <TextField
          fullWidth
          select
          label="Subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          required
          sx={{ mb: 2 }}
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
          sx={{ mb: 2 }}
        />

        <Button type="submit" variant="contained" fullWidth size="large" sx={{ backgroundColor: '#1976d2' }}>
          Submit Complaint
        </Button>
      </Box>

      <Typography variant="h5" sx={{ mt: 5 }}>
        Your Complaints
      </Typography>
      {complaints.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          No complaints found.
        </Typography>
      ) : (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {complaints.map((complaint) => (
            <Grid item xs={12} sm={6} key={complaint._id}>
              <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <strong>Subject:</strong> {complaint.subject}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Description:</strong> {complaint.complaintText}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Submitted on: {new Date(complaint.createdAt).toLocaleDateString()}
                  </Typography>

                  {complaint.reply ? (
                    <Alert severity="success" sx={{ mt: 2 }}>
                      <strong>Reply:</strong> {complaint.reply}
                      <br />
                      <small>Replied on: {new Date(complaint.repliedAt).toLocaleDateString()}</small>
                    </Alert>
                  ) : (
                    <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                      Not replied yet
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default StudentComplaintPage;
