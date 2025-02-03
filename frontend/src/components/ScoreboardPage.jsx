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
  Typography
} from '@mui/material';
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
    <div className="scoreboard-container">
      <Typography variant="h3" align="center" className="scoreboard-title">
        Scoreboard
      </Typography>

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <>
          {error && <div className="alert alert-danger text-center">{error}</div>}
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
                      {/* Main Row: Clicking anywhere toggles the details */}
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

                      {/* Expandable Details Row */}
                      <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                          <Collapse in={expandedRows[scoreboard._id]} timeout="auto" unmountOnExit>
                            <div className="expanded-content">
                              {['first', 'second', 'third'].map((position) => (
                                <div key={position} className="winner-section">
                                  <Typography variant="h6" className="winner-title text-capitalize">
                                    {position} Prize
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
                                </div>
                              ))}
                            </div>
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
    </div>
  );
};

export default ScoreboardPage;
