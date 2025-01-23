import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

  // Fetch departments and representatives on component load
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

      // Refresh representatives list
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

      // Refresh representatives list
      setRepresentatives(response.data.representatives);
    } catch (err) {
      console.error('Error removing representative:', err);
      setError(err.response?.data?.message || 'Failed to remove representative.');
    }
  };

  return (
    <div className="container mt-5">
      <h1>Manage Representatives</h1>

      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2>Add Representative</h2>
      <form onSubmit={handleAddRep}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="text"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Department:</label>
          <select
            name="departmentname"
            value={formData.departmentname}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Department</option>
            {departments.map((department) => (
              <option key={department._id} value={department._id}>
                {department.departmentname}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Add Representative</button>
      </form>

      <h2>Existing Representatives</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Username</th>
            <th>Name</th>
            <th>Department</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {representatives.map((rep) => (
            <tr key={rep._id}>
              <td>{rep.username}</td>
              <td>{rep.name}</td>
              <td>{rep.departmentname?.departmentname || 'No Department'}</td>
              <td>
                <button
                  style={{ color: 'red' }}
                  onClick={() => handleRemoveRep(rep._id)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageRepresentatives;
