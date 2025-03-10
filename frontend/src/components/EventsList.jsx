import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Container, Grid, CircularProgress, Alert, Box } from '@mui/material';
import { motion } from 'framer-motion';
import EventIcon from '@mui/icons-material/Event';
import GroupIcon from '@mui/icons-material/Group';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/EventsList.css';

const EventsList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('/student/events');
                setEvents(Array.isArray(response.data) ? response.data : []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching events:', error);
                setError('Failed to load events');
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const categorizedEvents = {
        offstage: (events || []).filter(event => event.stage === 'offstage'),
        onstage: (events || []).filter(event => event.stage === 'onstage')
    };

    return (
        <Container maxWidth="lg" className="events-container">
            <Box className="header-box">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="header-content"
                >
                    <EventIcon className="header-icon" />
                    <Typography variant="h4" className="header-title">
                        Upcoming Events
                    </Typography>
                    <Typography variant="body1" className="header-subtitle">
                        Browse the list of events you can participate in.
                    </Typography>
                </motion.div>
            </Box>

            {loading ? (
                <Box className="loading-box">
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error" className="error-alert">
                    {error}
                </Alert>
            ) : (
                ['offstage', 'onstage'].map(stage => (
                    <Box key={stage} className="stage-section">
                        <Typography variant="h4" className="stage-title">
                            {stage.charAt(0).toUpperCase() + stage.slice(1)} Events
                        </Typography>
                        <hr className="stage-divider" />
                        <Grid container spacing={3} className="events-grid">
                            {categorizedEvents[stage].length > 0 ? (
                                categorizedEvents[stage].map(event => (
                                    <Grid item xs={12} sm={6} md={4} key={event._id}>
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ type: 'spring', stiffness: 100 }}
                                        >
                                            <Card className="event-card">
                                                <CardContent>
                                                    <Typography variant="h5" className="event-title">
                                                        <EventIcon className="event-icon" /> {event.eventname}
                                                    </Typography>
                                                    <Typography variant="body1" className="event-category">
                                                        <GroupIcon className="event-icon" /> <strong>Category:</strong> {event.category}
                                                    </Typography>
                                                    <Typography variant="body1" className="event-participants">
                                                        <strong>Participants:</strong> {event.participants}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </Grid>
                                ))
                            ) : (
                                <Alert severity="info" className="alert">
                                    No {stage} events available.
                                </Alert>
                            )}
                        </Grid>
                    </Box>
                ))
            )}
        </Container>
    );
};

export default EventsList;