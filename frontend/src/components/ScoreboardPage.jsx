import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Collapse,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Alert,
  Box
} from '@mui/material';
import { motion } from 'framer-motion';
import '../styles/ScoreboardPage.css';

const ScoreboardPage = () => {
  const [scoreboards, setScoreboards] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/admin/view-scoreboard')
      .then((response) => {
        if (response.data && response.data.scoreboards) {
          setScoreboards(response.data.scoreboards);
        }
        setError(null);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load scoreboards.');
        setLoading(false);
      });
  }, []);

  const toggleRow = (scoreboardId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [scoreboardId]: !prev[scoreboardId]
    }));
  };

  return (
    <Box className="scoreboard-container">
      <div className="scoreboard-header">
        <Typography variant="h3" align="center" className="scoreboard-title">
          Results
        </Typography>
        <Typography variant="h6" align="center" className="scoreboard-subtitle">
          Click to view competition results
        </Typography>
      </div>

      {loading ? (
        <Box className="loading-box">
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <>
          {error && <Alert severity="error" className="alert">{error}</Alert>}
          <TableContainer component={Paper} className="table-container">
            <Table className="table-custom">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Event Name</TableCell>
                  <TableCell align="center">Category</TableCell>
                  <TableCell align="center">Last Updated</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scoreboards.length > 0 ? (
                  scoreboards.map((scoreboard) => (
                    <React.Fragment key={scoreboard._id}>
                      <TableRow
                        hover
                        className="main-row"
                        onClick={() => toggleRow(scoreboard._id)}
                      >
                        <TableCell align="center" className="clickable">
                          {scoreboard.eventName}
                        </TableCell>
                        <TableCell align="center">{scoreboard.category}</TableCell>
                        <TableCell align="center">
                          {new Date(scoreboard.lastUpdated).toLocaleString()}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                          <Collapse in={expandedRows[scoreboard._id]} timeout="auto" unmountOnExit>
                            <Box className="expanded-content">
                              {['first', 'second', 'third'].map((position) => (
                                <Box key={position} className="winner-section">
                                  <Typography variant="h6" className="winner-title">
                                    {position.charAt(0).toUpperCase() + position.slice(1)} Prize
                                  </Typography>
                                  <Table className="inner-table">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell align="center">Student Name</TableCell>
                                        <TableCell align="center">Grade</TableCell>
                                        <TableCell align="center">Class</TableCell>
                                        <TableCell align="center">Points</TableCell>
                                        <TableCell align="center">Department</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {scoreboard.winners[position].map((winner, index) => (
                                        <TableRow key={index}>
                                          <TableCell align="center">{winner.studentName}</TableCell>
                                          <TableCell align="center">{winner.grade}</TableCell>
                                          <TableCell align="center">{winner.className}</TableCell>
                                          <TableCell align="center">{winner.points}</TableCell>
                                          <TableCell align="center">
                                            {scoreboard.department.departmentname || 'N/A'}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </Box>
                              ))}
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No scoreboard entries found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default ScoreboardPage;
