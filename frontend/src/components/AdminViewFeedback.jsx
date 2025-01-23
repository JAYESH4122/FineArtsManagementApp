import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminViewFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch feedback data from the backend
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get("/admin/feedback");
        setFeedbacks(response.data.feedbacks);
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
        setError("Failed to fetch feedback data.");
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Student Feedback</h1>
      {error && <p className="text-danger text-center">{error}</p>}
      {feedbacks.length > 0 ? (
        <table className="table table-bordered table-hover bg-white">
          <thead>
            <tr>
              <th>#</th>
              <th>Student Name</th>
              <th>Feedback</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((feedback, index) => (
              <tr key={feedback._id}>
                <td>{index + 1}</td>
                <td>{feedback.studentName.name}</td>
                <td>{feedback.feedback}</td>
                <td>{new Date(feedback.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center">No feedback submitted yet.</p>
      )}
    </div>
  );
};

export default AdminViewFeedback;
