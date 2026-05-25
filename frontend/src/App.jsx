import React, { useState } from 'react';
import Dashboard from './pages/Dashboard.jsx';
import Landing from './pages/Landing.jsx';

export default function App() {
  const [page, setPage] = useState('landing');
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setPage('landing');
  };

  if (page === 'dashboard') {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }
  return <Landing onLogin={handleLogin} />;
}
