import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import '../styles/DepartmentRankings.css';
import { FaUniversity } from "react-icons/fa";

const DepartmentRankings = () => {
  const [departmentRankings, setDepartmentRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await axios.get('/admin/view-department-rankings');
        setDepartmentRankings(response.data.departmentRankings);
      } catch (err) {
        console.error('Error fetching department rankings:', err);
        setError('Failed to load department rankings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  return (
    <div className="rankings-container">
      {/* Page Header */}
      <div className="rankings-header">
        <FaUniversity className="header-icon" />
        <Typography variant="h4" className="header-title">Department Rankings</Typography>
        <Typography variant="subtitle1" className="header-subtext">
          Check the latest standings of departments.
        </Typography>
      </div>

      {/* Main Content */}
      <div className="table-wrapper">
        {loading ? (
          <div className="loading-container">
            <CircularProgress />
          </div>
        ) : error ? (
          <Alert severity="error" className="error-message">
            {error}
          </Alert>
        ) : (
          <TableContainer className="table-container">
            <Table>
              <TableHead>
                <TableRow className="table-header">
                  <TableCell className="table-header-cell">Rank</TableCell>
                  <TableCell className="table-header-cell">Department</TableCell>
                  <TableCell className="table-header-cell">Points</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {departmentRankings.length > 0 ? (
                  departmentRankings.map((ranking, index) => (
                    <motion.tr key={index} className="table-row" whileHover={{ scale: 1.02 }}>
                      <TableCell className="table-cell">{index + 1}</TableCell>
                      <TableCell className="table-cell">{ranking.departmentName}</TableCell>
                      <TableCell className="table-cell table-points">{ranking.totalPoints}</TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center" className="no-data">
                      No department rankings found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
};

export default DepartmentRankings;
