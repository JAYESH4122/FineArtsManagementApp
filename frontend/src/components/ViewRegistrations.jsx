import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Box, Grid, CircularProgress, Alert } from "@mui/material";
import "../styles/Registrations.css";

const ViewRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await axios.get("/deptrep/registrations");
        setRegistrations(response.data.registrations);
      } catch (error) {
        setErrorMessage("Failed to fetch registrations. Please try again.");
        console.error("Error fetching registrations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  return (
    <div className="registrations-container">
      {/* Header Section */}
      <Box
        sx={{
          backgroundColor: "#0ea5e9",
          padding: "30px",
          borderRadius: "8px",
          marginBottom: "40px",
          textAlign: "center",
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: "bold", color: "#ffffff" }}>
          Event Registrations
        </Typography>
        <Typography variant="h6" sx={{ color: "#ffffff", marginTop: "10px" }}>
          View the list of registered events and participants below.
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
          <CircularProgress />
        </Box>
      ) : errorMessage ? (
        <Alert severity="error" sx={{ marginBottom: "30px" }}>
          {errorMessage}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {registrations.map((registration, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ backgroundColor: "#ffffff", borderRadius: "16px", boxShadow: 3 }}>
                <CardContent>
                  {/* Event Name Styling */}
                  <Box
                    sx={{
                      padding: "15px",
                      backgroundColor: "#f0f9ff",
                      borderRadius: "8px",
                      marginBottom: "20px",
                    }}
                  >
                    <Typography
                      variant="h6"
                      align="center"
                      sx={{
                        fontWeight: "bold",
                        color: "#0ea5e9",
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "1.4rem",
                      }}
                    >
                      {registration.eventname}
                    </Typography>
                  </Box>

                  {/* Participant Section */}
                  {registration.teams.length > 0 ? (
                    registration.teams.map((team, teamIndex) => (
                      <div key={teamIndex} className="team-section">
                        {team.participants.length > 1 && (
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: "bold",
                              color: "#1e293b",
                              marginTop: "10px",
                              fontSize: "1.2rem",
                            }}
                          >
                            Team: {team.teamName}
                          </Typography>
                        )}
                        <ul className="participant-list">
                          {team.participants.map((participant, i) => (
                            <li key={i} className="participant-item team-participant">
                              <Box sx={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
                                <Typography variant="body1" sx={{ fontWeight: "bold", color: "#0ea5e9" }}>
                                  {participant.name}
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#64748b" }}>
                                  Class: {participant.className}
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#64748b" }}>
                                  Department: {participant.department}
                                </Typography>
                              </Box>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  ) : (
                    // For individual events, show participant list without team
                    <div className="individual-registration">
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: "bold",
                          color: "#1e293b",
                          fontSize: "1.2rem",
                        }}
                      >
                        Individual Participant
                      </Typography>
                      <ul className="participant-list">
                        {registration.participants.map((participant, i) => (
                          <li key={i} className="participant-item individual-participant">
                            <Box sx={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
                              <Typography variant="body1" sx={{ fontWeight: "bold", color: "#0ea5e9" }}>
                                {participant.name}
                              </Typography>
                              <Typography variant="body2" sx={{ color: "#64748b" }}>
                                Class: {participant.className}
                              </Typography>
                              <Typography variant="body2" sx={{ color: "#64748b" }}>
                                Department: {participant.department}
                              </Typography>
                            </Box>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default ViewRegistrations;
