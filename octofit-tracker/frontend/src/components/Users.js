import React, { useState, useEffect } from 'react';

const apiBase = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

const AVATAR_COLORS = ['#1f6feb','#30a14e','#d29922','#f85149','#bc8cff','#ff7b1f','#58a6ff','#3fb950'];
function avatarColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}
function initials(name) {
  return name.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase();
}
function teamClass(name) {
  if (!name) return 'team-other';
  const n = name.toLowerCase();
  if (n.includes('marvel')) return 'team-marvel';
  if (n.includes('dc')) return 'team-dc';
  return 'team-other';
}

function Users() {
  const [users, setUsers] = useState([]);
  const [teamMap, setTeamMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch from: https://${REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/
    const usersUrl = `${apiBase}/api/users/`;
    const teamsUrl = `${apiBase}/api/teams/`;
    console.log('Users: fetching from', usersUrl);
    console.log('Users: fetching teams from', teamsUrl);

    Promise.all([fetch(usersUrl), fetch(teamsUrl)])
      .then(([usersRes, teamsRes]) => Promise.all([usersRes.json(), teamsRes.json()]))
      .then(([usersData, teamsData]) => {
        console.log('Users: fetched data', usersData);
        console.log('Users: fetched teams', teamsData);
        const usersArr = Array.isArray(usersData) ? usersData : usersData.results || [];
        const teamsArr = Array.isArray(teamsData) ? teamsData : teamsData.results || [];
        const map = {};
        teamsArr.forEach((team) => { map[team._id] = team.name; });
        setUsers(usersArr);
        setTeamMap(map);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Users: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading-wrap"><div className="spinner"></div> Loading users…</div>;
  if (error) return <p className="text-danger p-3">Error: {error}</p>;

  return (
    <div className="page-section">
      <h2>👤 Users <span style={{fontSize:'0.85rem',color:'#8b949e',fontWeight:400}}>({users.length})</span></h2>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Team</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => {
            const name = user.name || '?';
            const teamName = teamMap[user.team_id] || user.team_id || '—';
            return (
              <tr key={user._id || user.id || idx}>
                <td>
                  <div className="user-cell">
                    <span className="avatar" style={{background: avatarColor(name)}}>{initials(name)}</span>
                    {name}
                  </div>
                </td>
                <td style={{color:'#8b949e'}}>{user.email}</td>
                <td><span className={`team-badge ${teamClass(teamName)}`}>{teamName}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Users;
