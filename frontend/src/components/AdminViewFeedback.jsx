import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import "../styles/AdminViewFeedback.css";

const AdminViewFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
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
    <Container maxWidth="md" className="feedback-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h4" className="feedback-title">
          Student Feedback
        </Typography>
      </motion.div>

      {error && <Alert severity="error" className="feedback-alert">{error}</Alert>}

      {feedbacks.length > 0 ? (
        <TableContainer component={Paper} className="table-container">
          <Table>
            <TableHead>
              <TableRow className="table-header">
                <TableCell>#</TableCell>
                <TableCell>Student Name</TableCell>
                <TableCell>Feedback</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feedbacks.map((feedback, index) => (
                <TableRow key={feedback._id} className="table-row">
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{feedback.studentName.name}</TableCell>
                  <TableCell>{feedback.feedback}</TableCell>
                  <TableCell>{new Date(feedback.date).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="h6" className="no-feedback">
          No feedback submitted yet.
        </Typography>
      )}
    </Container>
  );
};

export default AdminViewFeedback;
