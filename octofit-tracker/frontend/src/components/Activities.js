import React, { useState, useEffect } from 'react';

const apiBase = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

const ACTIVITY_BADGE = {
  running: 'badge-running', cycling: 'badge-cycling', swimming: 'badge-swimming',
  yoga: 'badge-yoga', boxing: 'badge-boxing', hiit: 'badge-hiit',
  weightlifting: 'badge-weightlifting',
};
function activityBadgeClass(type) {
  return ACTIVITY_BADGE[(type || '').toLowerCase()] || 'badge-default';
}
function formatDate(d) {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString(undefined, { year:'numeric', month:'short', day:'numeric' }); }
  catch { return d; }
}

function Activities() {
  const [activities, setActivities] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch from: https://${REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/
    const activitiesUrl = `${apiBase}/api/activities/`;
    const usersUrl = `${apiBase}/api/users/`;
    console.log('Activities: fetching from', activitiesUrl);
    console.log('Activities: fetching users from', usersUrl);

    Promise.all([fetch(activitiesUrl), fetch(usersUrl)])
      .then(([activitiesRes, usersRes]) => Promise.all([activitiesRes.json(), usersRes.json()]))
      .then(([activitiesData, usersData]) => {
        console.log('Activities: fetched data', activitiesData);
        console.log('Activities: fetched users', usersData);
        const activitiesArr = Array.isArray(activitiesData) ? activitiesData : activitiesData.results || [];
        const usersArr = Array.isArray(usersData) ? usersData : usersData.results || [];
        const map = {};
        usersArr.forEach((user) => { map[user._id] = user.name; });
        setActivities(activitiesArr);
        setUserMap(map);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Activities: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading-wrap"><div className="spinner"></div> Loading activities…</div>;
  if (error) return <p className="text-danger p-3">Error: {error}</p>;

  return (
    <div className="page-section">
      <h2>🏃 Activities <span style={{fontSize:'0.85rem',color:'#8b949e',fontWeight:400}}>({activities.length})</span></h2>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>User</th>
            <th>Activity Type</th>
            <th>Duration</th>
            <th>Calories</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity, idx) => (
            <tr key={activity._id || activity.id || idx}>
              <td style={{fontWeight:500}}>{userMap[activity.user_id] || activity.user_id}</td>
              <td>
                <span className={`badge-activity ${activityBadgeClass(activity.activity_type)}`}>
                  {activity.activity_type}
                </span>
              </td>
              <td><span className="stat-pill">⏱ {activity.duration} min</span></td>
              <td><span className="stat-pill">🔥 {activity.calories}</span></td>
              <td style={{color:'#8b949e',fontSize:'0.88rem'}}>{formatDate(activity.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Activities;
