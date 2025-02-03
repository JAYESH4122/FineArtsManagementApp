import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminAddScoreboard() {
  // Main form data includes event, category and winners for each position.
  const [formData, setFormData] = useState({
    eventName: '',
    category: '',
    winners: {
      first: { studentNames: [], classNames: [], grade: '', points: '' },
      second: { studentNames: [], classNames: [], grade: '', points: '' },
      third: { studentNames: [], classNames: [], grade: '', points: '' },
    },
    // departmentname will be set from the first selected student
    departmentname: '',
  });

  // Local state for autocomplete inputs for each winning position.
  // For each position, we store an array of objects for each team member:
  // { value, selected, showSuggestions }
  const [participantInputs, setParticipantInputs] = useState({
    first: [],
    second: [],
    third: [],
  });

  const [events, setEvents] = useState([]);
  const [students, setStudents] = useState([]);
  // teamSize is the number of participants per winning team (from the event)
  const [teamSize, setTeamSize] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch events and students on component mount.
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/admin/get-events');
        setEvents(response.data);
      } catch (err) {
        setError('Error fetching events');
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await axios.get('/admin/get-students');
        setStudents(response.data);
      } catch (err) {
        setError('Error fetching students');
      }
    };

    fetchEvents();
    fetchStudents();
  }, []);

  // When an event is selected, update category and initialize winner arrays.
  const handleEventChange = (e) => {
    const selectedEvent = events.find(
      (event) => event.eventname === e.target.value
    );
    const size = selectedEvent ? selectedEvent.participants : 0;
    setTeamSize(size);

    // Initialize winners for first, second, and third positions.
    setFormData((prev) => ({
      ...prev,
      eventName: e.target.value,
      category: selectedEvent ? selectedEvent.category : '',
      winners: {
        first: { studentNames: Array(size).fill(''), classNames: Array(size).fill(''), grade: '', points: '' },
        second: { studentNames: Array(size).fill(''), classNames: Array(size).fill(''), grade: '', points: '' },
        third: { studentNames: Array(size).fill(''), classNames: Array(size).fill(''), grade: '', points: '' },
      },
      departmentname: '',
    }));

    // Initialize autocomplete inputs for each position.
    setParticipantInputs({
      first: [...Array(size)].map(() => ({ value: '', selected: null, showSuggestions: false })),
      second: [...Array(size)].map(() => ({ value: '', selected: null, showSuggestions: false })),
      third: [...Array(size)].map(() => ({ value: '', selected: null, showSuggestions: false })),
    });
  };

  // Helper to get all selected student IDs across all positions.
  const getAllSelectedStudentIds = () => {
    const all = [];
    ['first', 'second', 'third'].forEach((pos) => {
      participantInputs[pos].forEach((input) => {
        if (input.selected && input.selected._id) {
          all.push(input.selected._id);
        }
      });
    });
    return all;
  };

  // Suggestions: Filter students that match the input text and haven't been selected yet.
  const getSuggestions = (inputValue) => {
    if (!inputValue) return [];
    const selectedIds = getAllSelectedStudentIds();
    return students.filter((student) => {
      if (!student.name) return false;
      const matches = student.name.toLowerCase().includes(inputValue.toLowerCase());
      const alreadySelected = selectedIds.includes(student._id);
      return matches && !alreadySelected;
    });
  };

  // Handle change in an autocomplete input for a given position and index.
  const handleParticipantInputChange = (position, index, inputValue) => {
    setParticipantInputs((prev) => {
      const updated = { ...prev };
      updated[position] = updated[position].map((input, i) =>
        i === index ? { ...input, value: inputValue, selected: null, showSuggestions: true } : input
      );
      return updated;
    });
    setFormData((prev) => {
      const updatedWinners = { ...prev.winners };
      updatedWinners[position].studentNames = updatedWinners[position].studentNames.map((name, i) =>
        i === index ? '' : name
      );
      updatedWinners[position].classNames = updatedWinners[position].classNames.map((cls, i) =>
        i === index ? '' : cls
      );
      return { ...prev, winners: updatedWinners };
    });
  };

  // When a student is selected from suggestions.
  const handleSelectStudent = (position, index, student) => {
    setParticipantInputs((prev) => {
      const updated = { ...prev };
      updated[position] = updated[position].map((input, i) =>
        i === index ? { ...input, value: student.name, selected: student, showSuggestions: false } : input
      );
      return updated;
    });
    setFormData((prev) => {
      const updatedWinners = { ...prev.winners };
      updatedWinners[position].studentNames = updatedWinners[position].studentNames.map((name, i) =>
        i === index ? student.name : name
      );
      updatedWinners[position].classNames = updatedWinners[position].classNames.map((cls, i) =>
        i === index ? student.className?._id || student.className : cls
      );
      // Set the department if not already set (using first selected student).
      const dept = prev.departmentname || (student.departmentname?._id || student.departmentname);
      return { ...prev, winners: updatedWinners, departmentname: dept };
    });
  };

  // For grade and points fields per winning position.
  const handleWinnerFieldChange = (position, field, value) => {
    setFormData((prev) => ({
      ...prev,
      winners: {
        ...prev.winners,
        [position]: {
          ...prev.winners[position],
          [field]: value,
        },
      },
    }));
  };

  // Submit the form.
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that every team member for each position is selected.
    const positions = ['first', 'second', 'third'];
    for (const pos of positions) {
      if (
        participantInputs[pos].length !== teamSize ||
        participantInputs[pos].some((input) => !input.selected)
      ) {
        setError(`Ensure that all winners are selected for the ${pos} position.`);
        return;
      }
    }

    try {
      const payload = {
        eventName: formData.eventName,
        category: formData.category,
        winners: formData.winners,
        departmentname: formData.departmentname,
      };
      const response = await axios.post('/admin/add-scoreboard', payload);
      if (response.data.success) {
        setSuccess(response.data.success);
        setError(null);
        // Reset form
        setFormData({
          eventName: '',
          category: '',
          winners: {
            first: { studentNames: [], classNames: [], grade: '', points: '' },
            second: { studentNames: [], classNames: [], grade: '', points: '' },
            third: { studentNames: [], classNames: [], grade: '', points: '' },
          },
          departmentname: '',
        });
        setParticipantInputs({ first: [], second: [], third: [] });
        setTeamSize(0);
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
        {/* Event selection */}
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
        {/* Category auto-filled */}
        <div className="mb-3">
          <label className="form-label">Category</label>
          <input type="text" className="form-control" value={formData.category} readOnly />
        </div>
        {/* Winner Sections for 1st, 2nd, and 3rd positions */}
        {['first', 'second', 'third'].map((position) => (
          <div key={position} className="mb-4 p-3 border rounded">
            <h4 className="mb-3 text-capitalize">{position} Winner</h4>
            {participantInputs[position].map((input, index) => (
              <div key={index} className="mb-3 position-relative">
                <label className="form-label">Team Member {index + 1} Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Start typing student name..."
                  value={input.value}
                  onChange={(e) => handleParticipantInputChange(position, index, e.target.value)}
                  onFocus={() =>
                    setParticipantInputs((prev) => {
                      const updated = { ...prev };
                      updated[position] = updated[position].map((inp, i) =>
                        i === index ? { ...inp, showSuggestions: true } : inp
                      );
                      return updated;
                    })
                  }
                  required
                />
                {input.showSuggestions && (
                  <ul
                    className="list-group position-absolute w-100"
                    style={{ zIndex: 1000, maxHeight: '150px', overflowY: 'auto' }}
                  >
                    {getSuggestions(input.value).map((student) => (
                      <li
                        key={student._id}
                        className="list-group-item list-group-item-action"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSelectStudent(position, index, student)}
                      >
                        {student.name}
                      </li>
                    ))}
                  </ul>
                )}
                {input.selected && (
                  <div className="mt-2 p-2 border rounded bg-light">
                    <small>
                      Department:{' '}
                      <strong>
                        {input.selected.departmentname?.departmentname ||
                          input.selected.departmentname}
                      </strong>
                      &nbsp;|&nbsp; Class:{' '}
                      <strong>
                        {input.selected.className?.className || input.selected.className}
                      </strong>
                    </small>
                  </div>
                )}
              </div>
            ))}
            {/* Grade dropdown */}
            <div className="mb-3">
              <label className="form-label">Grade</label>
              <select
                className="form-control"
                value={formData.winners[position].grade}
                onChange={(e) => handleWinnerFieldChange(position, 'grade', e.target.value)}
                required
              >
                <option value="">Select Grade</option>
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="B+">B+</option>
                <option value="B">B</option>
                <option value="C+">C+</option>
                <option value="C">C</option>
              </select>
            </div>
            {/* Points input */}
            <div className="mb-3">
              <label className="form-label">Points</label>
              <input
                type="number"
                className="form-control"
                value={formData.winners[position].points}
                onChange={(e) => handleWinnerFieldChange(position, 'points', e.target.value)}
                required
                min="0"
              />
            </div>
          </div>
        ))}
        <button type="submit" className="btn btn-primary w-100">
          Add to Scoreboard
        </button>
      </form>
    </div>
  );
}

export default AdminAddScoreboard;