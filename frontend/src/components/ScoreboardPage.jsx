import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ScoreboardPage.css';

const ScoreboardPage = () => {
  const [scoreboards, setScoreboards] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/admin/view-scoreboard')
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

  const getPointsClass = (points) => {
    if (points >= 50) return 'text-success';
    if (points >= 20) return 'text-warning';
    return 'text-danger';
  };

  return (
    <div className="scoreboard-container">
      <h1 className="text-center scoreboard-title">Scoreboard</h1>

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <>
          {error && <div className="alert alert-danger text-center">{error}</div>}
          <div className="table-responsive">
            <table className="table table-hover table-custom">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Category</th>
                  <th>Winning Students</th>
                  <th>Prize</th>
                  <th>Classes</th>
                  <th>Department</th>
                  <th>Points</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {scoreboards.length > 0 ? (
                  scoreboards.map((scoreboard) => (
                    <tr key={scoreboard._id}>
                      <td>{scoreboard.eventName}</td>
                      <td>{scoreboard.category}</td>
                      <td>{scoreboard.studentNames?.join(', ') || 'N/A'}</td>
                      <td>{scoreboard.prize}</td>
                      <td>
                        {scoreboard.classNames?.map(cls =>
                          typeof cls === 'object' ? cls.className : cls
                        ).join(', ') || 'N/A'}
                      </td>
                      <td>{scoreboard.departmentname?.departmentname || 'N/A'}</td>
                      <td className={getPointsClass(scoreboard.points)}>{scoreboard.points}</td>
                      <td>{new Date(scoreboard.lastUpdated).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">No scoreboard entries found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ScoreboardPage;