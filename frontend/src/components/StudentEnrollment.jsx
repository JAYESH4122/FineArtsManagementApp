import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, utcToZonedTime } from 'date-fns-tz'; // Import date-fns-tz
import '../styles/StudentEnrollment.css';

const StudentEnrollment = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    eventId: '',
    participantDetails: [
      {
        name: '', // Automatically pre-fill with student's name
        className: '', // Automatically pre-fill with student's class from session
      },
    ],
  });
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [enrolledEvents, setEnrolledEvents] = useState([]);
  const [sessionUser, setSessionUser] = useState(null); // Store session user data here

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch events, enrolled events and session user data
        const eventsRes = await axios.get('/student/get-events'); // Fetch events
        const enrolledRes = await axios.get('/student/enrollment-requests'); // Get enrolled events
        const sessionUserRes = await axios.get('/student/session-user'); // Get session user data

        setEvents(eventsRes.data.events);
        console.log("Updated events state:", eventsRes.data.events);
        setEnrolledEvents(enrolledRes.data.requests); // Ensure enrolled events include event details
        console.log("Updated enrolled events state:", enrolledRes.data.requests);
        setSessionUser(sessionUserRes.data); // Store session user data

        // Pre-fill form with session user data
        if (sessionUserRes.data) {
          setFormData({
            eventId: '',
            participantDetails: [
              {
                name: sessionUserRes.data.name || '', // Use session user name
                className: sessionUserRes.data.className || '', // Use session user class
              },
            ],
          });
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  // Handle changes in event selection
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'eventId') {
      setFormData({
        ...formData,
        [name]: value,
        participantDetails: [
          {
            name: sessionUser?.name || '', // Ensure session user name is used
            className: sessionUser?.className || '', // Ensure session user class is used
          },
        ],
      });
    }
  };

  // Handle form submission
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
  
      // Fetch updated events after enrollment
      const updatedEventsRes = await axios.get('/student/get-events');
      setEvents(updatedEventsRes.data.events); // Update events list with the latest data
  
      // Find the newly enrolled event from the events list to get category and other details
      const enrolledEvent = updatedEventsRes.data.events.find(event => event._id === formData.eventId);
      console.log(enrolledEvent);

  
      if (enrolledEvent) {
        // Add the newly enrolled event to the list of enrolled events, including category
        setEnrolledEvents((prev) => [
          ...prev,
          {
            eventId: enrolledEvent, // Store the full event details including category
            participantDetails: res.data.request.participants, // Participant details from response
            requestedAt: res.data.request.requestedAt, // Include the requestedAt from the response
          },
        ]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send enrollment request');
      setSuccess(null);
    }
  };
  

  // Helper function to format date using date-fns-tz
  const formatToIST = (date) => {
    if (!date) return 'Unknown';
    try {
      const zonedDate = utcToZonedTime(new Date(date), 'Asia/Kolkata'); // Convert UTC to IST
      return format(zonedDate, 'dd/MM/yyyy, hh:mm:ss a'); // Format as desired
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Invalid Date';
    }
  };

  return (
    <div className="student-enrollment">
      <h1 className="title">Event Enrollment</h1>

      {success && <p className="success-message">{success}</p>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="enrollment-form">
        <div className="form-group">
          <label>Event:</label>
          <select
            name="eventId"
            value={formData.eventId}
            onChange={handleChange}
            required
          >
            <option value="">Select Event</option>
            {events.map((event) => (
              <option key={event._id} value={event._id}>
                {event.eventname} ({event.participants} participants) | {event.category} {/* Updated to category */}
              </option>
            ))}
          </select>
        </div>

        {formData.eventId && (
          <div className="form-group">
            <label>Participant Name:</label>
            <input
              type="text"
              value={formData.participantDetails[0]?.name || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  participantDetails: [
                    { ...formData.participantDetails[0], name: e.target.value },
                  ],
                })
              }
              placeholder="Enter name"
              required
            />

            <label>Class:</label>
            <input
              type="text"
              value={sessionUser?.className || formData.participantDetails[0]?.className || ''}
              readOnly // Make class name a pre-filled (read-only) field
              required
            />
          </div>
        )}

        <button type="submit" className="submit-button">Enroll</button>
      </form>

      <h2 className="subtitle">Enrolled Events</h2>
      <ul className="enrolled-events">
  {enrolledEvents.map((event, index) => (
    <li key={index}>
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
