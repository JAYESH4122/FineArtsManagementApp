import React, { useState } from 'react';
import axios from 'axios';

const AnnouncementForm = ({ successMessage, errorMessage }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [audience, setAudience] = useState('all');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const announcementData = {
      title,
      content,
      audience,
    };

    try {
      // Sending POST request to the server
      const response = await axios.post('/admin/add-announcement', announcementData);
      if (response.data.success) {
        setMessage('Announcement posted successfully!');
      }
    } catch (error) {
      setMessage('Error posting announcement. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Post Announcements</h1>
      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'} text-center`} role="alert">
          {message}
        </div>
      )}

      <div className="row justify-content-center">
        <div className="col-md-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control"
                placeholder="Enter announcement title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="content" className="form-label">Content</label>
              <textarea
                id="content"
                name="content"
                className="form-control"
                rows="6"
                placeholder="Write your announcement here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="audience" className="form-label">Target Audience</label>
              <select
                id="audience"
                name="audience"
                className="form-select"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                required
              >
                <option value="all">All Users</option>
                <option value="students">Students Only</option>
                <option value="departmentReps">Department Representatives Only</option>
              </select>
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">Post Announcement</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementForm;
