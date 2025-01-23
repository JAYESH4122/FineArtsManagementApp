import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DepartmentRankings = () => {
  const [departmentRankings, setDepartmentRankings] = useState([]);

  useEffect(() => {
    // Fetch department rankings from the backend
    const fetchRankings = async () => {
      try {
        const response = await axios.get('/admin/view-department-rankings'); // Adjust this endpoint if needed
        setDepartmentRankings(response.data.departmentRankings);
      } catch (err) {
        console.error('Error fetching department rankings:', err);
      }
    };

    fetchRankings();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Department Rankings</h1>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Department Name</th>
              <th>Total Points</th>
            </tr>
          </thead>
          <tbody>
            {departmentRankings.length > 0 ? (
              departmentRankings.map((ranking, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{ranking.departmentName}</td>
                  <td>{ranking.totalPoints}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  No department rankings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentRankings;
