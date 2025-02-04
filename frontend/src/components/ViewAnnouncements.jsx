import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Grid,
  Container
} from '@mui/material';
import { motion } from 'framer-motion';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import InfoIcon from '@mui/icons-material/Info';
import EventNoteIcon from '@mui/icons-material/EventNote';
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Announcements.css";

const ViewAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get('/admin/view-announcements');
        if (response.data && response.data.announcements?.length > 0) {
          setAnnouncements(response.data.announcements);
        } else {
          setError('No announcements found.');
        }
      } catch (err) {
        setError('Failed to load announcements. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <Container maxWidth="md" className="announcements-container">
      <Box elevation={3} className="header-box">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="header-content"
        >
          <AnnouncementIcon className="header-icon" />
          <Typography variant="h4" className="header-title">
            Announcements
          </Typography>
          <Typography variant="body1" className="header-subtitle">
            Stay updated with the latest news and events.
          </Typography>
        </motion.div>
      </Box>

      {loading ? (
        <Box className="loading-box">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" className="alert">
          {error}
        </Alert>
      ) : (
        <Grid container spacing={3} className="announcement-list">
          {announcements.length > 0 ? (
            announcements.map((announcement) => (
              <Grid item xs={12} sm={6} key={announcement._id}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 120 }}
                >
                  <Card className="announcement-card">
                    <CardContent>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="title-content"
                      >
                        <Typography variant="h5" className="announcement-title">
                          <EventNoteIcon className="title-icon" /> {announcement.title}
                        </Typography>
                        <Typography variant="body1" className="announcement-content">
                          {announcement.content}
                        </Typography>
                      </motion.div>
                      <Typography variant="body2" className="announcement-audience">
                        <InfoIcon className="audience-icon" /> <strong>Audience:</strong> {announcement.audience}
                      </Typography>
                      <Typography variant="caption" className="announcement-date">
                        {new Date(announcement.datePosted).toDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))
          ) : (
            <Alert severity="info" className="alert">
              No announcements available.
            </Alert>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default ViewAnnouncements;
