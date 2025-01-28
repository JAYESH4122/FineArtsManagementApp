import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Box, CircularProgress, Alert } from '@mui/material';
import "../styles/Announcements.css";

const ViewAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        // Send GET request to backend
        const response = await axios.get('/admin/view-announcements');
        console.log('API Response:', response.data);  // Log the full response

        // If announcements are found, set them in state
        if (response.data && response.data.announcements && response.data.announcements.length > 0) {
          setAnnouncements(response.data.announcements);
        } else {
          setError('No announcements found.');
        }
      } catch (err) {
        // Log error for better debugging
        console.error('Error fetching announcements:', err);
        setError('Failed to load announcements. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="announcements-container">
      {/* Header Section */}
      <Box
        sx={{
          backgroundColor: '#0ea5e9',
          padding: '30px',
          borderRadius: '8px',
          marginBottom: '40px',
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
          Announcements
        </Typography>
        <Typography variant="h6" sx={{ color: '#ffffff', marginTop: '10px' }}>
          View the latest announcements below.
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ marginBottom: '30px' }}>
          {error}
        </Alert>
      ) : (
        <div className="announcement-list">
          {announcements.length > 0 ? (
            announcements.map((announcement) => (
              <Card key={announcement._id} sx={{ marginBottom: '20px', borderRadius: '16px', boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#0ea5e9' }}>
                    {announcement.title}
                  </Typography>
                  <Typography variant="body1" sx={{ marginTop: '10px' }}>
                    <strong>Audience:</strong> {announcement.audience}
                  </Typography>
                  <Typography variant="body2" sx={{ marginTop: '10px' }}>
                    {announcement.content}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', marginTop: '10px' }}>
                    <small>{new Date(announcement.datePosted).toDateString()}</small>
                  </Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Alert severity="info" sx={{ marginBottom: '30px' }}>
              No announcements available.
            </Alert>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewAnnouncements;
