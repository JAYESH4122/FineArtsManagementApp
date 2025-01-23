import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState(null);

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
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center">Announcements</h1>

      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      <div className="list-group">
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <div key={announcement._id} className="list-group-item">
              <h4>{announcement.title}</h4>
              <p><strong>Audience:</strong> {announcement.audience}</p>
              <p>{announcement.content}</p>
              <p><small>{new Date(announcement.datePosted).toDateString()}</small></p>
            </div>
          ))
        ) : (
          <div className="alert alert-info text-center" role="alert">
            No announcements available.
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAnnouncements;
