import React, { useState, useEffect } from 'react';

const apiBase = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

function rankDisplay(rank, idx) {
  const n = rank || idx + 1;
  if (n === 1) return <span className="rank-cell rank-1">🥇 1</span>;
  if (n === 2) return <span className="rank-cell rank-2">🥈 2</span>;
  if (n === 3) return <span className="rank-cell rank-3">🥉 3</span>;
  return <span className="rank-cell" style={{color:'#8b949e'}}>#{n}</span>;
}

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch from: https://${REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/
    const leaderboardUrl = `${apiBase}/api/leaderboard/`;
    const usersUrl = `${apiBase}/api/users/`;
    console.log('Leaderboard: fetching from', leaderboardUrl);
    console.log('Leaderboard: fetching users from', usersUrl);

    Promise.all([fetch(leaderboardUrl), fetch(usersUrl)])
      .then(([lbRes, usersRes]) => Promise.all([lbRes.json(), usersRes.json()]))
      .then(([lbData, usersData]) => {
        console.log('Leaderboard: fetched data', lbData);
        console.log('Leaderboard: fetched users', usersData);
        const entriesArr = Array.isArray(lbData) ? lbData : lbData.results || [];
        const usersArr = Array.isArray(usersData) ? usersData : usersData.results || [];
        const map = {};
        usersArr.forEach((user) => { map[user._id] = user.name; });
        setEntries(entriesArr);
        setUserMap(map);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Leaderboard: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading-wrap"><div className="spinner"></div> Loading leaderboard…</div>;
  if (error) return <p className="text-danger p-3">Error: {error}</p>;

  return (
    <div className="page-section">
      <h2>🏆 Leaderboard <span style={{fontSize:'0.85rem',color:'#8b949e',fontWeight:400}}>({entries.length})</span></h2>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Rank</th>
            <th>User</th>
            <th>Calories</th>
            <th>Duration</th>
            <th>Activities</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, idx) => (
            <tr key={entry._id || entry.id || idx}>
              <td>{rankDisplay(entry.rank, idx)}</td>
              <td style={{fontWeight:500}}>{userMap[entry.user_id] || entry.user_id}</td>
              <td><span className="stat-pill">🔥 {entry.total_calories}</span></td>
              <td><span className="stat-pill">⏱ {entry.total_duration} min</span></td>
              <td><span className="stat-pill">📋 {entry.total_activities}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;
