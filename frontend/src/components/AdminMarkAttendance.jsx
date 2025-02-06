import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Checkbox, FormControlLabel, Button, Box, Grid, CircularProgress, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import '../styles/AdminMarkAttendance.css';

const AdminMarkAttendance = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await axios.get('/admin/view-enrollment-requests');
        if (response.data.success) {
          setEvents(response.data.events);
          setLoading(false);
        } else {
          setError('Failed to fetch data.');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching enrollments:', error);
        setError('Server error. Please try again.');
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  const handleAttendanceChange = (eventId, participantId) => {
    setAttendance((prevAttendance) => ({
      ...prevAttendance,
      [eventId]: {
        ...prevAttendance[eventId],
        [participantId]: !prevAttendance[eventId]?.[participantId]
      }
    }));
  };

  const handleSubmitAttendance = async (eventId) => {
    try {
      const response = await axios.post(`/admin/submit-attendance/${eventId}`, {
        attendance: attendance[eventId] || {}
      });

      if (response.data.success) {
        alert(`Attendance for event '${eventId}' marked successfully!`);
      } else {
        alert('Failed to update attendance.');
      }
    } catch (error) {
      console.error('Error submitting attendance:', error);
      alert('Server error. Please try again.');
    }
  };

  return (
    <div className="attendance-container">
      <Box className="header-box">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Typography variant="h4" className="header-title">
            Mark Event Attendance
          </Typography>
          <Typography variant="body1" className="header-subtitle">
            Select participants who attended the event.
          </Typography>
        </motion.div>
      </Box>

      {loading ? (
        <Box className="loading-box">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" className="alert">{error}</Alert>
      ) : (
        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid item xs={12} key={event.eventId}>
              <motion.div whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 120 }}>
                <Card className="event-card">
                  <CardContent>
                    <Box className="event-header">
                      <Typography variant="h5" className="event-title">
                        {event.eventname}
                      </Typography>
                      <ExpandMoreIcon className="expand-icon" />
                    </Box>

                    <Box className="participant-list">
                      {event.participants.map((participant) => (
                        <FormControlLabel
                          key={participant._id}
                          control={
                            <Checkbox
                              checked={attendance[event.eventId]?.[participant._id] || false}
                              onChange={() => handleAttendanceChange(event.eventId, participant._id)}
                            />
                          }
                          label={`${participant.name} (Adm No: ${participant.admno}, Class: ${participant.className.className})`}
                          className="participant-checkbox"
                        />
                      ))}
                    </Box>

                    {/* Submit Button for Each Event */}
                    <Box className="submit-box">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleSubmitAttendance(event.eventId)}
                      >
                        Submit Attendance
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default AdminMarkAttendance;
