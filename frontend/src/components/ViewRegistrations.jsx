import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Collapse,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EventIcon from "@mui/icons-material/Event";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Registrations.css";

const ViewRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

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

  const handleExpandClick = (eventname) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [eventname]: !prevExpanded[eventname],
    }));
  };

  return (
    <div className="registrations-container">
      <Box className="header-box">
        <EventIcon className="header-icon" />
        <Typography variant="h6" className="header-title">
          Event Registrations
        </Typography>
        <Typography variant="body2" className="header-subtitle">
          Click on an event to view participants grouped by department
        </Typography>
      </Box>

      {loading ? (
        <Box className="loading-box">
          <CircularProgress />
        </Box>
      ) : errorMessage ? (
        <Alert severity="error" className="error-alert">
          {errorMessage}
        </Alert>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {registrations.map((registration, index) => {
            // Group participants by department
            const departmentWiseParticipants = {};

            registration.teams.forEach((team) => {
              team.participants.forEach((participant) => {
                const deptName = participant.department || "Unknown Department";
                if (!departmentWiseParticipants[deptName]) {
                  departmentWiseParticipants[deptName] = [];
                }
                departmentWiseParticipants[deptName].push(participant);
              });
            });

            return (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card className="event-card">
                  <CardContent>
                    <Box
                      className="event-header"
                      onClick={() => handleExpandClick(registration.eventname)}
                    >
                      <Typography variant="h6" className="event-title">
                        {registration.eventname}
                      </Typography>
                      <IconButton
                        className={
                          expanded[registration.eventname]
                            ? "expand-icon expanded"
                            : "expand-icon"
                        }
                      >
                        <ExpandMoreIcon />
                      </IconButton>
                    </Box>
                    <Collapse
                      in={expanded[registration.eventname]}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box className="participant-container">
                        {Object.entries(departmentWiseParticipants).map(
                          ([deptName, participants], deptIndex) => (
                            <div key={deptIndex} className="department-section">
                              <Typography
                                variant="h6"
                                className="department-title"
                              >
                                {deptName}
                              </Typography>
                              <ul className="participant-list">
                                {participants.map((participant, i) => (
                                  <li key={i} className="participant-item">
                                    <Box className="participant-box">
                                      <PersonIcon className="participant-icon" />
                                      <Typography
                                        variant="body1"
                                        className="participant-name"
                                      >
                                        {participant.name}
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        className="participant-detail"
                                      >
                                        Class: {participant.className}
                                      </Typography>
                                    </Box>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )
                        )}
                      </Box>
                    </Collapse>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </div>
  );
};

export default ViewRegistrations;
