import React, { useState, useEffect } from 'react';

const apiBase = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

function diffClass(d) {
  const v = (d || '').toLowerCase();
  if (v.includes('begin')) return 'diff-beginner';
  if (v.includes('inter')) return 'diff-intermediate';
  if (v.includes('advanc')) return 'diff-advanced';
  return 'diff-beginner';
}

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = `${apiBase}/api/workouts/`;
    console.log('Workouts: fetching from', url);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log('Workouts: fetched data', data);
        const results = Array.isArray(data) ? data : data.results || [];
        setWorkouts(results);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Workouts: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading-wrap"><div className="spinner"></div> Loading workouts…</div>;
  if (error) return <p className="text-danger p-3">Error: {error}</p>;

  return (
    <div className="page-section">
      <h2>💪 Workouts <span style={{fontSize:'0.85rem',color:'#8b949e',fontWeight:400}}>({workouts.length})</span></h2>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Difficulty</th>
            <th>Duration</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {workouts.map((workout, idx) => (
            <tr key={workout._id || workout.id || idx}>
              <td style={{fontWeight:600}}>{workout.name}</td>
              <td>
                {workout.category && (
                  <span className="badge-activity badge-default">{workout.category}</span>
                )}
              </td>
              <td>
                {workout.difficulty && (
                  <span className={diffClass(workout.difficulty)}>{workout.difficulty}</span>
                )}
              </td>
              <td>{workout.duration ? <span className="stat-pill">⏱ {workout.duration} min</span> : '—'}</td>
              <td style={{color:'#8b949e',fontSize:'0.88rem'}}>{workout.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Workouts;
