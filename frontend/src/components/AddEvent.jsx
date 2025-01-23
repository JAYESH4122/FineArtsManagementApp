import React, { useState } from 'react';
import axios from 'axios';

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
      // Send the form data to the backend via POST request
      const response = await axios.post('/admin/add-event', {
        eventname: eventName,
        category: category,
        participants: participants,
        date: date,
        description: description
      });

      if (response.data.success) {
        setSuccess('Event added successfully');
        setError(null);
        // Optionally reset the form
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
    <div className="container mt-5">
      <h1 className="text-center mb-4">Add Event</h1>

      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success text-center" role="alert">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mx-auto shadow-lg p-4 rounded"
        style={{ maxWidth: '600px', backgroundColor: '#f8f9fa' }}
      >
        <div className="mb-3">
          <label htmlFor="eventname" className="form-label">
            Event Name:
          </label>
          <input
            type="text"
            id="eventname"
            name="eventname"
            className="form-control"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Enter event name"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="category" className="form-label">
            Event Category:
          </label>
          <input
            type="text"
            id="category"
            name="category"
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter event category"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="participants" className="form-label">
            No. of Participants:
          </label>
          <input
            type="number"
            id="participants"
            name="participants"
            className="form-control"
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
            placeholder="Number of Participants"
            required
            min="0"
            max="20"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="date" className="form-label">
            Date and Time:
          </label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            placeholder="Provide a brief description of the event"
            required
          ></textarea>
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary btn-block">
            Add Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEvent;
