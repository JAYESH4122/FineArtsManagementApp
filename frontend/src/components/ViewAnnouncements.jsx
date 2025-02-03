import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Box, CircularProgress, Alert, Grid, Container } from '@mui/material';
import { motion } from 'framer-motion';

const ViewAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get('/admin/view-announcements');
        console.log('API Response:', response.data);
        
        if (response.data && response.data.announcements?.length > 0) {
          setAnnouncements(response.data.announcements);
        } else {
          setError('No announcements found.');
        }
      } catch (err) {
        console.error('Error fetching announcements:', err);
        setError('Failed to load announcements. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box
          sx={{
            backgroundColor: '#0ea5e9',
            padding: '30px',
            borderRadius: '12px',
            textAlign: 'center',
            color: '#ffffff',
            boxShadow: 2
          }}
        >
          <Typography variant="h3" fontWeight="bold">
            Announcements
          </Typography>
          <Typography variant="h6" mt={1}>
            Stay updated with the latest news and events.
          </Typography>
        </Box>
      </motion.div>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      ) : (
        <Grid container spacing={3} mt={4}>
          {announcements.length > 0 ? (
            announcements.map((announcement) => (
              <Grid item xs={12} sm={6} key={announcement._id}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 100 }}
                >
                  <Card
                    sx={{
                      borderRadius: '12px',
                      boxShadow: 3,
                      backgroundColor: '#ffffff',
                      transition: '0.3s ease-in-out'
                    }}
                  >
                    <CardContent>
                      <Typography variant="h5" fontWeight="bold" color="primary">
                        {announcement.title}
                      </Typography>
                      <Typography variant="body1" mt={1}>
                        <strong>Audience:</strong> {announcement.audience}
                      </Typography>
                      <Typography variant="body2" mt={1}>
                        {announcement.content}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" mt={2} display="block">
                        {new Date(announcement.datePosted).toDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))
          ) : (
            <Alert severity="info" sx={{ mt: 4, width: '100%' }}>
              No announcements available.
            </Alert>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default ViewAnnouncements;
