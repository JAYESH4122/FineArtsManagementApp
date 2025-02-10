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
        const eventsRes = await axios.get('/student/get-events');
        setEvents(eventsRes.data.events || []);
        
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
        setEvents([]);
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

      // ✅ Reload enrolled events immediately after registering
      const updatedEnrolledRes = await axios.get('/student/enrollment-requests');
      setEnrolledEvents(updatedEnrolledRes.data?.requests || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send enrollment request');
      setSuccess(null);
    }
  };

  const handleUnregister = async (eventId) => {
    try {
      const res = await axios.delete(`/student/unregister-event/${eventId}`);
      setSuccess(res.data.message);
      setError(null);

      // ✅ Reload enrolled events immediately after unregistering
      setEnrolledEvents(enrolledEvents.filter(event => event._id !== eventId));
    } catch (err) {
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

        {/* ✅ Success Message directly below the Submit Button */}
        {success && <p className="success-message">{success}</p>}
        {error && <p className="error-message">{error}</p>}
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
