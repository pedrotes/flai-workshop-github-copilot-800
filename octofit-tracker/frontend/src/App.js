import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import './App.css';
import Users from './components/Users';
import Activities from './components/Activities';
import Teams from './components/Teams';
import Leaderboard from './components/Leaderboard';
import Workouts from './components/Workouts';

function Home() {
  const navigate = useNavigate();
  const features = [
    { icon: '👤', label: 'Users',       path: '/users' },
    { icon: '🏃', label: 'Activities',  path: '/activities' },
    { icon: '🤝', label: 'Teams',       path: '/teams' },
    { icon: '🏆', label: 'Leaderboard', path: '/leaderboard' },
    { icon: '💪', label: 'Workouts',    path: '/workouts' },
  ];
  return (
    <div className="octofit-hero">
      <img src="/octofitapp-small.png" alt="OctoFit Tracker" width="110" />
      <h1>OctoFit Tracker</h1>
      <p className="lead">Track your fitness activities, join teams, and compete on the leaderboard.</p>
      <div className="feature-cards">
        {features.map((f) => (
          <div key={f.path} className="feature-card" onClick={() => navigate(f.path)}>
            <div className="fc-icon">{f.icon}</div>
            <div className="fc-label">{f.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">
            <img src="/octofitapp-small.png" alt="OctoFit" width="36" height="36" />
            OctoFit Tracker
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-2">
              {[
                { icon: '👤', label: 'Users',       path: '/users' },
                { icon: '🏃', label: 'Activities',  path: '/activities' },
                { icon: '🤝', label: 'Teams',       path: '/teams' },
                { icon: '🏆', label: 'Leaderboard', path: '/leaderboard' },
                { icon: '💪', label: 'Workouts',    path: '/workouts' },
              ].map(({ icon, label, path }) => (
                <li className="nav-item" key={path}>
                  <NavLink
                    className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
                    to={path}
                  >
                    {icon} {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <div className="container" style={{ maxWidth: '1100px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
