import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { FaUniversity } from "react-icons/fa";
import { GiTrophyCup } from "react-icons/gi";
import '../styles/DepartmentRankings.css';

const DepartmentRankings = () => {
  const [departmentRankings, setDepartmentRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await axios.get('/admin/view-department-rankings');
        console.log("Department Rankings Fetched:", response.data);
        if (response.data.departmentRankings && response.data.departmentRankings.length > 0) {
          setDepartmentRankings(response.data.departmentRankings);
        } else {
          setError("No department rankings found.");
        }
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
      <motion.div 
        className="rankings-header" 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}>
        <FaUniversity className="header-icon" />
        <Typography variant="h4" className="header-title">Department Rankings</Typography>
        <Typography variant="subtitle1" className="header-subtext">
          Check the latest standings of departments.
        </Typography>
      </motion.div>

      {/* Main Content */}
      <div className="table-wrapper">
        {loading ? (
          <div className="loading-container">
            <CircularProgress size={60} thickness={5} color="inherit" />
          </div>
        ) : error ? (
          <Alert severity="error" className="error-message">
            {error}
          </Alert>
        ) : (
          <TableContainer component={Paper} className="table-container">
            <Table>
              <TableHead>
                <TableRow className="table-header">
                  <TableCell className="table-header-cell">Rank</TableCell>
                  <TableCell className="table-header-cell">Department</TableCell>
                  <TableCell className="table-header-cell">Points</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {departmentRankings && departmentRankings.length > 0 ? (
                  departmentRankings.map((ranking, index) => (
                    <motion.tr 
                      key={index} 
                      className={`table-row ${index === 0 ? 'gold-rank' : index === 1 ? 'silver-rank' : index === 2 ? 'bronze-rank' : ''}`} 
                      whileHover={{ scale: 1.02 }}>
                      <TableCell className="table-cell rank-cell">
                        {index < 3 ? <GiTrophyCup className={`trophy trophy-${index}`} /> : null} {index + 1}
                      </TableCell>
                      <TableCell className="table-cell department-cell">{ranking.departmentName || "N/A"}</TableCell>
                      <TableCell className="table-cell table-points">{ranking.totalPoints || 0}</TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center" className="no-data">
                      No department rankings available.
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