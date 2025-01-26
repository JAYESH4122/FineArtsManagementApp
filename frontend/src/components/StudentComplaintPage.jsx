import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentComplaintPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [departmentRepName, setDepartmentRepName] = useState('');
  const [form, setForm] = useState({ subject: '', description: '' });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data } = await axios.get('/student/complaints');
      setComplaints(data.complaints);
      setDepartmentRepName(data.departmentRepName); // Store department rep name
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/student/complaints', form);
      fetchComplaints();
      setForm({ subject: '', description: '' });
    } catch (error) {
      console.error('Error submitting complaint:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Student Complaints</h1>
      <h5 className="text-secondary mb-4">
        Complaints will be sent to: <strong>{departmentRepName}</strong>
      </h5>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Subject</label>
          <input
            type="text"
            className="form-control"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows="3"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Submit Complaint</button>
      </form>

      <hr />

      <h2>Your Complaints</h2>
      {complaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        complaints.map((complaint) => (
          <div className="card mb-4 shadow-sm" key={complaint._id}>
            <div className="card-body">
              <h5 className="card-title"><strong>Subject:</strong> {complaint.subject}</h5>
              <p className="card-text"><strong>Description:</strong> {complaint.complaintText}</p>
              <p className="card-text"><strong>Submitted on:</strong> {new Date(complaint.createdAt).toLocaleDateString()}</p>
              {complaint.reply ? (
                <div className="alert alert-success">
                  <strong>Reply:</strong> {complaint.reply}
                  <br />
                  <small>Replied on: {new Date(complaint.repliedAt).toLocaleDateString()}</small>
                </div>
              ) : (
                <p className="text-danger">Not replied yet</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default StudentComplaintPage;
