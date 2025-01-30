import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminAddScoreboard() {
  const [formData, setFormData] = useState({
    eventName: '',
    category: '',
    studentNames: [],
    prize: '',
    classNames: [], // Store class for each student
    departmentname: '',
    points: ''
  });

  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [events, setEvents] = useState([]);
  const [participants, setParticipants] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch departments and events on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('/admin/get-departments');
        console.log(response.data); // Log the departments to check if the data is correct
        if (Array.isArray(response.data)) {
          setDepartments(response.data);
        } else {
          console.error('Unexpected response format:', response.data);
          setError('Unexpected response format');
        }
      } catch (err) {
        console.error('Error fetching departments', err);
        setError('Error fetching departments');
      }
    };
  
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/admin/get-events');
        setEvents(response.data);
      } catch (err) {
        console.error('Error fetching events', err);
      }
    };
  
    fetchDepartments();
    fetchEvents();
  }, []);
  

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle event change (set category and participants based on event)
  const handleEventChange = (e) => {
    const selectedEvent = events.find(event => event.eventname === e.target.value);
    setFormData((prevData) => ({
      ...prevData,
      eventName: e.target.value,
      category: selectedEvent ? selectedEvent.category : ''
    }));
    setParticipants(selectedEvent ? selectedEvent.participants : 0);
  };

  // Handle department change (load classes based on department)
  const handleDepartmentChange = (e) => {
    const selectedDepartment = departments.find(dept => dept._id === e.target.value);

    setFormData((prevData) => ({
      ...prevData,
      departmentname: e.target.value,
      classNames: [] // Reset class names when department changes
    }));

    // Set classes for the selected department
    setClasses(selectedDepartment ? selectedDepartment.classes : []);
  };

  // Handle class selection for a participant
  const handleClassSelection = (index, classId) => {
    const updatedClassNames = [...formData.classNames];
    updatedClassNames[index] = classId;
    setFormData((prevData) => ({
      ...prevData,
      classNames: updatedClassNames
    }));
  };

  // Handle student name change
  const handleStudentNameChange = (index, value) => {
    const updatedNames = [...formData.studentNames];
    updatedNames[index] = value;
    setFormData((prevData) => ({
      ...prevData,
      studentNames: updatedNames
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/admin/add-scoreboard', formData);
      if (response.data.success) {
        setSuccess(response.data.success);
        setError(null);
      }
    } catch (err) {
      setError('Error adding scoreboard entry');
      setSuccess(null);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Add to Scoreboard</h1>

      {error && <div className="alert alert-danger text-center">{error}</div>}
      {success && <div className="alert alert-success text-center">{success}</div>}

      <form onSubmit={handleSubmit}>
        {/* Event Name */}
        <div className="mb-3">
          <label htmlFor="eventName" className="form-label">Event Name</label>
          <select
            name="eventName"
            id="eventName"
            className="form-control"
            value={formData.eventName}
            onChange={handleEventChange}
            required
          >
            <option value="">Select Event</option>
            {events.map(event => (
              <option key={event._id} value={event.eventname}>
                {event.eventname}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <input
            type="text"
            name="category"
            id="category"
            className="form-control"
            value={formData.category}
            readOnly
          />
        </div>

        {/* Department Name */}
        <div className="mb-3">
          <label htmlFor="departmentname" className="form-label">Department Name</label>
          <select
            name="departmentname"
            id="departmentname"
            className="form-control"
            value={formData.departmentname}
            onChange={handleDepartmentChange}
            required
          >
            <option value="">Select Department</option>
            {departments.length > 0 ? (
              departments.map(dept => (
                <option key={dept._id} value={dept._id}>
                  {dept.departmentname}
                </option>
              ))
            ) : (
              <option disabled>No departments available</option>
            )}
          </select>
        </div>

        {/* Winning Students */}
        <div className="mb-3">
          <label className="form-label">Winning Students</label>
          {[...Array(participants)].map((_, index) => (
            <div key={index} className="mb-3">
              {/* Student Name */}
              <input
                type="text"
                className="form-control mb-2"
                placeholder={`Winner ${index + 1} Name`}
                value={formData.studentNames[index] || ''}
                onChange={(e) => handleStudentNameChange(index, e.target.value)}
                required
              />

              {/* Class Select (Only shows classes for the selected department) */}
              <select
                name={`classNames[${index}]`}
                className="form-control"
                value={formData.classNames[index] || ''}
                onChange={(e) => handleClassSelection(index, e.target.value)}
                required
              >
                <option value="">Select Class</option>
                {classes.length > 0 ? (
                  classes.map(cls => (
                    <option key={cls._id} value={cls._id}>
                      {cls.className}
                    </option>
                  ))
                ) : (
                  <option disabled>No classes available</option>
                )}
              </select>
            </div>
          ))}
        </div>

        {/* Prize */}
        <div className="mb-3">
          <label htmlFor="prize" className="form-label">Prize</label>
          <input
            type="text"
            name="prize"
            id="prize"
            className="form-control"
            value={formData.prize}
            onChange={handleChange}
            required
          />
        </div>

        {/* Points */}
        <div className="mb-3">
          <label htmlFor="points" className="form-label">Points</label>
          <input
            type="number"
            name="points"
            id="points"
            className="form-control"
            value={formData.points}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">Add to Scoreboard</button>
      </form>
    </div>
  );
}

export default AdminAddScoreboard;
