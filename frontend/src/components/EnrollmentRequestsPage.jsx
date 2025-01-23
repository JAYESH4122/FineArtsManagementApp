import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/EnrollmentRequestsPage.css";

const EnrollmentRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEnrollmentRequests = async () => {
      try {
        const response = await axios.get("/student/view-all-enrollments");
        if (response.data.requests) {
          setRequests(response.data.requests);
        } else {
          setRequests([]);
        }
        setError("");
      } catch (err) {
        console.error("Error fetching enrollment requests:", err);
        setError("Failed to load enrollment requests. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollmentRequests();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (requests.length === 0) {
    return <div className="no-requests">No enrollment requests found.</div>;
  }

  return (
    <div className="enrollment-requests-container">
      <h1 className="page-title">Enrolled List</h1>
      <div className="requests-list">
        {requests.map((request) => (
          <div className="request-card" key={request._id}>
            <div className="card-header">
              <h3 className="event-name">{request.eventId.eventname}</h3>
              <p className="event-date">
                {new Date(request.eventId.date).toLocaleDateString()}
              </p>
            </div>
            <p className="event-category">{request.eventId.category || "N/A"}</p>
            <div className="participants-section">
              <h4 className="participants-title">Participants:</h4>
              <ul className="participants-list">
                {request.participants.map((participant) => (
                  <li key={participant._id} className="participant-item">
                    <div className="participant-info">
                      <span className="participant-name">{participant.name}</span>
                      <span className="participant-class">
                        ({participant.className.className})
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnrollmentRequestsPage;
