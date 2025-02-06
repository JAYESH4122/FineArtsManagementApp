import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, utcToZonedTime } from 'date-fns-tz';
import { motion } from 'framer-motion';
import '../styles/StudentEnrollment.css';

const StudentEnrollment = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    eventId: '',
    participantDetails: [{ name: '', className: '' }],
  });
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [enrolledEvents, setEnrolledEvents] = useState([]);
  const [sessionUser, setSessionUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        try {
          const eventsRes = await axios.get('/student/get-events');
          console.log("Full API Response:", eventsRes.data);
        
          if (Array.isArray(eventsRes.data.events)) {
            setEvents(eventsRes.data.events);
          } else {
            console.error("API Response is not an array:", eventsRes.data.events);
            setEvents([]); // Set empty array if data is incorrect
          }
        } catch (err) {
          console.error('Error fetching data:', err);
        }
        
  
        const enrolledRes = await axios.get('/student/enrollment-requests');
        setEnrolledEvents(enrolledRes.data?.requests || []);
  
        const sessionUserRes = await axios.get('/student/session-user');
        setSessionUser(sessionUserRes.data || null);
  
        if (sessionUserRes.data) {
          setFormData({
            eventId: '',
            participantDetails: [{
              name: sessionUserRes.data.name || '',
              className: sessionUserRes.data.className || '',
            }],
          });
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setEvents([]); // Ensure events is always an array
      }
    };
    fetchData();
  }, []);
  
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      participantDetails: [
        {
          name: sessionUser?.name || prev.participantDetails[0].name,
          className: sessionUser?.className || prev.participantDetails[0].className,
        },
      ],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.eventId) {
      setError('Event ID is required.');
      setSuccess(null);
      return;
    }
    try {
      const res = await axios.post('/student/request-enrollment', formData);
      setSuccess(res.data.message);
      setError(null);
      setFormData({ eventId: '', participantDetails: [] });
      const updatedEventsRes = await axios.get('/student/get-events');
      setEvents(updatedEventsRes.data.events);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send enrollment request');
      setSuccess(null);
    }
  };

  const handleUnregister = async (eventId) => {
    console.log("Attempting to unregister from event ID:", eventId); // Debugging
  
    try {
      const res = await axios.delete(`/student/unregister-event/${eventId}`);
      console.log("Unregister Response:", res.data); // Debugging
  
      setSuccess(res.data.message);
      setError(null);
  
      // Update state to remove the unregistered event from the list
      setEnrolledEvents(enrolledEvents.filter(event => event._id !== eventId));
  
    } catch (err) {
      console.error("Error unregistering:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to unregister from event");
      setSuccess(null);
    }
  };
  

  const formatToIST = (date) => {
    if (!date) return 'Unknown';
    try {
      const zonedDate = utcToZonedTime(new Date(date), 'Asia/Kolkata');
      return format(zonedDate, 'dd/MM/yyyy, hh:mm:ss a');
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Invalid Date';
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Event Enrollment</h1>
      {success && <p className="success-message">{success}</p>}
      {error && <p className="error-message">{error}</p>}
      
      <motion.form onSubmit={handleSubmit} className="dashboard-form" whileHover={{ scale: 1.02 }}>
        <div className="form-group">
          <label>Event:</label>
          <select name="eventId" value={formData.eventId} onChange={handleChange} required>
  <option value="">Select Event</option>
  {events.length > 0 ? (
    events.map((event) => (
      <option key={event._id} value={event._id}>
        {event.eventname} ({event.participants} participants) | {event.category} | {event.stage}
      </option>
    ))
  ) : (
    <option disabled>No events available</option>
  )}
</select>


        </div>
        {formData.eventId && (
          <div className="form-group">
            <label>Participant Name:</label>
            <input type="text" value={formData.participantDetails[0]?.name || ''} readOnly required />
            <label>Class:</label>
            <input type="text" value={formData.participantDetails[0]?.className || ''} readOnly required />
          </div>
        )}
        <button type="submit" className="dashboard-button">Enroll</button>
      </motion.form>
      
      <h2 className="dashboard-subtitle">Enrolled Events</h2>
      <ul className="dashboard-list">
        {enrolledEvents.map((event, index) => (
          <li key={index} className="dashboard-list-item">
            <strong>Event:</strong> {event.eventId?.eventname || 'Unknown'} | 
            <strong> Category:</strong> {event.eventId?.category || 'Unknown'} | 
            <strong> Date:</strong> {formatToIST(event.requestedAt)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentEnrollment;
