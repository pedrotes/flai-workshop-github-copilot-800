import React, { useState, useEffect } from 'react';

const apiBase = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch from: https://${REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/
    const url = `${apiBase}/api/teams/`;
    console.log('Teams: fetching from', url);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log('Teams: fetched data', data);
        const results = Array.isArray(data) ? data : data.results || [];
        setTeams(results);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Teams: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading-wrap"><div className="spinner"></div> Loading teams…</div>;
  if (error) return <p className="text-danger p-3">Error: {error}</p>;

  return (
    <div className="page-section">
      <h2>🤝 Teams <span style={{fontSize:'0.85rem',color:'#8b949e',fontWeight:400}}>({teams.length})</span></h2>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Team Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, idx) => (
            <tr key={team._id || team.id || idx}>
              <td style={{fontWeight:600}}>
                <span className={`team-badge ${
                  team.name?.toLowerCase().includes('marvel') ? 'team-marvel' :
                  team.name?.toLowerCase().includes('dc') ? 'team-dc' : 'team-other'
                }`}>{team.name}</span>
              </td>
              <td style={{color:'#8b949e',fontSize:'0.9rem'}}>{team.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Teams;
