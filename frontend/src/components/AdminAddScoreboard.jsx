import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminAddScoreboard() {
  const [formData, setFormData] = useState({
    eventName: '',
    category: '',
    studentNames: [],
    prize: '',
    classNames: [],
    departmentname: '',
    points: '',
  });

  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [events, setEvents] = useState([]);
  const [participants, setParticipants] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('/admin/get-departments');
        if (Array.isArray(response.data)) {
          setDepartments(response.data);
        } else {
          setError('Unexpected response format for departments');
        }
      } catch (err) {
        setError('Error fetching departments');
      }
    };

    const fetchEvents = async () => {
      try {
        const response = await axios.get('/admin/get-events');
        setEvents(response.data);
      } catch (err) {
        setError('Error fetching events');
      }
    };

    fetchDepartments();
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEventChange = (e) => {
    const selectedEvent = events.find((event) => event.eventname === e.target.value);
    setFormData((prevData) => ({
      ...prevData,
      eventName: e.target.value,
      category: selectedEvent ? selectedEvent.category : '',
    }));
    setParticipants(selectedEvent ? selectedEvent.participants : 0);
  };

  const handleDepartmentChange = (e) => {
    const selectedDepartment = departments.find((dept) => dept._id === e.target.value);
    setFormData((prevData) => ({
      ...prevData,
      departmentname: e.target.value,
      classNames: [],
    }));
    setClasses(selectedDepartment ? selectedDepartment.classes : []);
  };

  const handleClassSelection = (index, classId) => {
    const updatedClassNames = [...formData.classNames];
    updatedClassNames[index] = classId;
    setFormData((prevData) => ({
      ...prevData,
      classNames: updatedClassNames,
    }));
  };

  const handleStudentNameChange = (index, value) => {
    const updatedNames = [...formData.studentNames];
    updatedNames[index] = value;
    setFormData((prevData) => ({
      ...prevData,
      studentNames: updatedNames,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.studentNames.length !== participants || formData.classNames.length !== participants) {
      setError('Ensure all winners and their classes are entered');
      return;
    }

    try {
      const response = await axios.post('/admin/add-scoreboard', {
        ...formData,
        points: Number(formData.points), // Ensure points is sent as a number
      });

      if (response.data.success) {
        setSuccess(response.data.success);
        setError(null);
        setFormData({
          eventName: '',
          category: '',
          studentNames: [],
          prize: '',
          classNames: [],
          departmentname: '',
          points: '',
        });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error adding scoreboard entry');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Add to Scoreboard</h1>

      {error && <div className="alert alert-danger text-center">{error}</div>}
      {success && <div className="alert alert-success text-center">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Event Name</label>
          <select className="form-control" value={formData.eventName} onChange={handleEventChange} required>
            <option value="">Select Event</option>
            {events.map((event) => (
              <option key={event._id} value={event.eventname}>
                {event.eventname}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <input type="text" className="form-control" value={formData.category} readOnly />
        </div>

        <div className="mb-3">
          <label className="form-label">Department Name</label>
          <select className="form-control" value={formData.departmentname} onChange={handleDepartmentChange} required>
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.departmentname}
              </option>
            ))}
          </select>
        </div>

        {[...Array(participants)].map((_, index) => (
          <div key={index} className="mb-3">
            <input
              type="text"
              className="form-control mb-2"
              placeholder={`Winner ${index + 1} Name`}
              value={formData.studentNames[index] || ''}
              onChange={(e) => handleStudentNameChange(index, e.target.value)}
              required
            />
            <select className="form-control" value={formData.classNames[index] || ''} onChange={(e) => handleClassSelection(index, e.target.value)} required>
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.className}
                </option>
              ))}
            </select>
          </div>
        ))}

        <div className="mb-3">
          <label className="form-label">Prize</label>
          <input type="text" className="form-control" name="prize" value={formData.prize} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Points</label>
          <input type="number" className="form-control" name="points" value={formData.points} onChange={handleChange} required />
        </div>

        <button type="submit" className="btn btn-primary w-100">Add to Scoreboard</button>
      </form>
    </div>
  );
}

export default AdminAddScoreboard;
