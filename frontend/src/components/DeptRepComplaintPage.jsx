import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DeptRepComplaintPage = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data } = await axios.get('/deptrep/complaints');
      setComplaints(data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  const handleReply = async (complaintId, replyText) => {
    try {
      await axios.post('/deptrep/reply-to-complaint', { complaintId, replyText });
      fetchComplaints();
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Department Representative Complaints</h1>
      {complaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        complaints.map((complaint) => (
          <div className="card mb-4 shadow-sm" key={complaint._id}>
            <div className="card-body">
              <h5 className="card-title"><strong>Subject:</strong> {complaint.subject}</h5>
              <p className="card-text"><strong>Description:</strong> {complaint.complaintText}</p>
              <p className="card-text"><strong>From:</strong> {complaint.studentId.name} (Roll No: {complaint.studentId.rollno})</p>
              <p className="card-text"><strong>Submitted on:</strong> {new Date(complaint.createdAt).toLocaleDateString()}</p>
              {complaint.reply ? (
                <div className="alert alert-success">
                  <strong>Reply:</strong> {complaint.reply}
                  <br />
                  <small>Replied on: {new Date(complaint.repliedAt).toLocaleDateString()}</small>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const replyText = e.target.replyText.value;
                    handleReply(complaint._id, replyText);
                  }}
                >
                  <div className="mb-3">
                    <label className="form-label">Reply</label>
                    <textarea
                      name="replyText"
                      className="form-control"
                      rows="3"
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">Submit Reply</button>
                </form>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DeptRepComplaintPage;
