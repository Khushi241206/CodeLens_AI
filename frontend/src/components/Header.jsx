import React from 'react';

const s = {
  hdr: {
    display: 'flex', alignItems: 'center', gap: 16,
    padding: '0 20px', height: 52,
    background: 'var(--surf)', borderBottom: '1px solid var(--border)',
    flexShrink: 0,
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: 8,
    fontSize: 16, fontWeight: 800, letterSpacing: '-.03em',
  },
  logoAccent: {
    background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  tabBtn: {
    padding: '6px 14px', borderRadius: 7, border: 'none',
    background: 'none', color: 'var(--t3)',
    fontSize: 12, fontWeight: 600, letterSpacing: '.04em',
    textTransform: 'uppercase', cursor: 'pointer', transition: 'all .15s',
  },
  right: { marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14 },
  stat: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--t3)', fontFamily: 'var(--mono)' },
  logoutBtn: {
    padding: '5px 12px', borderRadius: 6, border: '1px solid var(--border2)',
    background: 'none', color: 'var(--t2)', fontSize: 11, cursor: 'pointer', transition: 'all .15s',
  },
};

export default function Header({ user, onLogout, activeTab, onTabChange, stats }) {
  return (
    <header style={s.hdr}>
      <div style={s.logo}>🔍 <span style={s.logoAccent}>CodeLens</span></div>
      {['prs', 'custom', 'stats'].map(tab => (
        <button key={tab} style={{
          ...s.tabBtn,
          background: activeTab === tab ? 'var(--over)' : 'none',
          color: activeTab === tab ? 'var(--t1)' : 'var(--t3)',
        }} onClick={() => onTabChange(tab)}>
          {tab === 'prs' ? 'Pull Requests' : tab === 'custom' ? 'Custom Review' : 'Analytics'}
        </button>
      ))}
      <div style={s.right}>
        {stats?.total > 0 && (
          <>
            <div style={s.stat}>Reviewed: <b style={{ color: 'var(--t1)' }}>{stats.total}</b></div>
            <div style={s.stat}>Avg Score: <b style={{ color: 'var(--acc)' }}>{stats.avgScore}</b></div>
          </>
        )}
        <div style={s.stat}>● <b style={{ color: 'var(--grn)' }}>Claude Sonnet 4</b></div>
        {user && (
          <button style={s.logoutBtn}
            onMouseEnter={e => { e.target.style.background = 'var(--over)'; e.target.style.color = 'var(--t1)'; }}
            onMouseLeave={e => { e.target.style.background = 'none'; e.target.style.color = 'var(--t2)'; }}
            onClick={onLogout}
          >
            {user.name} · Logout
          </button>
        )}
      </div>
    </header>
  );
}
