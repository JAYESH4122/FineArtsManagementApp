import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Container,
  Grid,
  Paper,
} from '@mui/material';
import { motion } from 'framer-motion';
import '../styles/AddEvent.css';

const AddEvent = () => {
  const [eventName, setEventName] = useState('');
  const [category, setCategory] = useState('');
  const [participants, setParticipants] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/admin/add-event', {
        eventname: eventName,
        category: category,
        participants: participants,
        date: date,
        description: description,
      });

      if (response.data.success) {
        setSuccess('Event added successfully');
        setError(null);
        setEventName('');
        setCategory('');
        setParticipants('');
        setDate('');
        setDescription('');
      } else {
        setSuccess(null);
        setError('Failed to add event. Please try again.');
      }
    } catch (err) {
      console.error('Error adding event:', err);
      setError('Failed to add event. Please try again.');
      setSuccess(null);
    }
  };

  return (
    <Container maxWidth="md" className="add-event-container">
      <Box className="header-box">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h4" className="header-title">
            Add Event
          </Typography>
        </motion.div>
      </Box>

      {error && <Alert severity="error" className="alert">{error}</Alert>}
      {success && <Alert severity="success" className="alert">{success}</Alert>}

      <Paper elevation={6} className="form-box">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Event Name"
                name="eventname"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Event Category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="No. of Participants"
                type="number"
                name="participants"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                required
                inputProps={{ min: 0, max: 20 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date and Time"
                type="datetime-local"
                name="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" className="submit-btn">
            Add Event
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AddEvent;
