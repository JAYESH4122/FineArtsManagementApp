import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, CircularProgress, Alert } from '@mui/material';
import { motion } from 'framer-motion';

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
    <>
      {/* Header */}
      <Box sx={{ backgroundColor: '#0ea5e9', py: 4, textAlign: 'center', color: '#fff' }}>
        <Typography variant="h3" fontWeight="bold">
          Department Rankings
        </Typography>
        <Typography variant="subtitle1" mt={1}>
          Check the latest standings of departments.
        </Typography>
      </Box>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ py: 4 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" mt={5}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 4 }}>
            {error}
          </Alert>
        ) : (
          <>
            {/* Responsive Table for Mobile & Desktop */}
            <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, overflowX: 'auto' }}>
              <Table sx={{ minWidth: 300 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#1e3a8a' }}>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Rank</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Department</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Points</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {departmentRankings.length > 0 ? (
                    departmentRankings.map((ranking, index) => (
                      <motion.tr key={index} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>{index + 1}</TableCell>
                        <TableCell>{ranking.departmentName}</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#0ea5e9' }}>{ranking.totalPoints}</TableCell>
                      </motion.tr>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        No department rankings found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Container>

      {/* Footer */}
      <Box sx={{ backgroundColor: '#1e3a8a', py: 3, textAlign: 'center', color: '#ffffff', mt: 5, width: '100%',align: 'bottom' }}>
        <Typography variant="body2" sx={{ fontSize: '14px' }}>© 2025 Fine Arts Festival - All Rights Reserved</Typography>
      </Box>
    </>
  );
};

export default DepartmentRankings;
