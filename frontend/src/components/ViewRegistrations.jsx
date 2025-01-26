import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Registrations.css";

const ViewRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await axios.get("/deptrep/registrations");
        setRegistrations(response.data.registrations);
      } catch (error) {
        setErrorMessage("Failed to fetch registrations. Please try again.");
        console.error("Error fetching registrations:", error);
      }
    };

    fetchRegistrations();
  }, []);

  return (
    <div className="registrations-container">
      <h1>Event Registrations</h1>
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {registrations.map((registration, index) => (
        <div key={index} className="registration-card">
          <h2 className="event-name">{registration.eventname}</h2>

          {registration.teams.map((team, teamIndex) => (
            <div key={teamIndex} className="team-section">
              {team.teamName && <h3 className="team-name">{team.teamName}</h3>}
              <ul className="participant-list">
                {team.participants.map((participant, i) => (
                  <li key={i} className="participant-item">
                    <div className="participant-info">
                      <span className="participant-name">{participant.name}</span>
                      <span className="participant-class">
                        Class: {participant.className}
                      </span>
                      <span className="participant-department">
                        Department: {participant.department}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ViewRegistrations;