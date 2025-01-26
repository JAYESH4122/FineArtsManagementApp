import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/EventRegistrationForm.css";

const RegisterEvent = () => {
  const [events, setEvents] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsResponse = await axios.get("/deptrep/events");
        setEvents(eventsResponse.data.events);

        const studentsResponse = await axios.get("/deptrep/get-students-reg");
        setStudents(studentsResponse.data.students);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleEventChange = (eventId) => {
    const selected = events.find((event) => event._id === eventId);
    setSelectedEvent(selected);
    setParticipants(new Array(selected.participants).fill({ name: "", className: "" }));
  };

  const handleStudentNameChange = (index, name) => {
    const newParticipants = [...participants];
    newParticipants[index] = { ...newParticipants[index], name };
  
    const student = students.find((student) => student.name === name);
    if (student) {
      newParticipants[index].className = student.className;
      newParticipants[index].admno = student.admno; // Include admno
    } else {
      newParticipants[index].className = "";
      newParticipants[index].admno = ""; // Clear admno if no match
    }
  
    setParticipants(newParticipants);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear any previous error messages
  
    try {
      const response = await axios.post("/deptrep/register", {
        eventId: selectedEvent._id,
        participants,
      });
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.data.error) {
        setErrorMessage(error.response.data.error); // Show backend error messages
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div>
        <label>Select Event</label>
        <select onChange={(e) => handleEventChange(e.target.value)} required>
          <option value="">Select an event</option>
          {events.map((event) => (
            <option key={event._id} value={event._id}>
              {event.eventname}
            </option>
          ))}
        </select>
      </div>

      {selectedEvent && (
        <>
          <div>
            <label>Number of Participants: {selectedEvent.participants}</label>
          </div>

          {participants.map((_, index) => (
            <div key={index}>
              <label>Student {index + 1} Name</label>
              <input
                type="text"
                list="students-list"
                value={participants[index].name}
                onChange={(e) => handleStudentNameChange(index, e.target.value)}
                required
              />
              <datalist id="students-list">
                {students.map((student) => (
                  <option key={student._id} value={student.name} />
                ))}
              </datalist>

              <label>Class Name</label>
              <input
                type="text"
                value={participants[index].className}
                readOnly
                required
              />
            </div>
          ))}
        </>
      )}

      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterEvent;
