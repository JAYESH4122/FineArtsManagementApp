import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Container,
  Grid,
} from '@mui/material';
import { motion } from 'framer-motion';
import '../styles/ManageRepresentatives.css';

const ManageRepresentatives = () => {
  const [departments, setDepartments] = useState([]);
  const [representatives, setRepresentatives] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    departmentname: '',
  });
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/admin/manage-rep');
        setDepartments(data.departments);
        setRepresentatives(data.representatives);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data.');
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddRep = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post('/admin/manage-rep', formData);
      setSuccess(response.data.message);
      setError(null);
      setFormData({ username: '', password: '', name: '', departmentname: '' });
      setRepresentatives(response.data.representatives);
    } catch (err) {
      console.error('Error adding representative:', err);
      setError(err.response?.data?.message || 'Failed to add representative.');
    }
  };

  const handleRemoveRep = async (id) => {
    try {
      const response = await axios.post(`/admin/remove-rep/${id}`);
      setSuccess(response.data.message);
      setError(null);
      setRepresentatives(response.data.representatives);
    } catch (err) {
      console.error('Error removing representative:', err);
      setError(err.response?.data?.message || 'Failed to remove representative.');
    }
  };

  return (
    <Container maxWidth="md" className="manage-rep-container">
      <Box className="header-box">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h4" className="header-title">
            Manage Representatives
          </Typography>
        </motion.div>
      </Box>

      {success && <Alert severity="success" className="alert">{success}</Alert>}
      {error && <Alert severity="error" className="alert">{error}</Alert>}

      <Box className="form-box">
        <Typography variant="h5" className="form-title">Add Representative</Typography>
        <form onSubmit={handleAddRep}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  name="departmentname"
                  value={formData.departmentname}
                  onChange={handleInputChange}
                  required
                >
                  <MenuItem value="">Select Department</MenuItem>
                  {departments.map((department) => (
                    <MenuItem key={department._id} value={department._id}>
                      {department.departmentname}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" className="submit-btn">
            Add Representative
          </Button>
        </form>
      </Box>

      <Box className="table-box">
        <Typography variant="h5" className="table-title">Existing Representatives</Typography>
        <TableContainer component={Paper} className="table-container">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Username</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Department</strong></TableCell>
                <TableCell><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {representatives.map((rep) => (
                <TableRow key={rep._id}>
                  <TableCell>{rep.username}</TableCell>
                  <TableCell>{rep.name}</TableCell>
                  <TableCell>{rep.departmentname?.departmentname || 'No Department'}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleRemoveRep(rep._id)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default ManageRepresentatives;
