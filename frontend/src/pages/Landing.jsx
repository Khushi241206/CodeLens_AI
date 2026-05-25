import React, { useState } from 'react';

const s = {
  page: {
    minHeight: '100vh', background: 'var(--bg)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '40px 20px', animation: 'fadeIn .4s ease',
  },
  card: {
    background: 'var(--surf)', border: '1px solid var(--border2)',
    borderRadius: 20, padding: '44px 48px', maxWidth: 480, width: '100%',
    boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: 10,
    fontSize: 26, fontWeight: 800, letterSpacing: '-.03em', marginBottom: 8,
  },
  logoAccent: {
    background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  tagline: { fontSize: 13, color: 'var(--t2)', marginBottom: 32, lineHeight: 1.6 },
  features: { display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 },
  feature: {
    display: 'flex', alignItems: 'center', gap: 10,
    fontSize: 13, color: 'var(--t2)',
    padding: '10px 14px', background: 'var(--over)', borderRadius: 9,
    border: '1px solid var(--border)',
  },
  featureIcon: { fontSize: 16, flexShrink: 0 },
  label: { fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 6 },
  input: {
    width: '100%', background: 'var(--over)', border: '1px solid var(--border2)',
    borderRadius: 9, padding: '11px 14px', color: 'var(--t1)',
    fontSize: 13, outline: 'none', marginBottom: 14, transition: 'border-color .15s',
    fontFamily: 'var(--font)',
  },
  btn: {
    width: '100%', padding: '13px', borderRadius: 10, border: 'none',
    background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
    color: '#fff', fontSize: 14, fontWeight: 700,
    cursor: 'pointer', transition: 'all .2s',
    boxShadow: '0 4px 16px rgba(99,102,241,.4)',
  },
  skip: {
    marginTop: 14, width: '100%', padding: '10px',
    borderRadius: 9, border: '1px solid var(--border2)',
    background: 'transparent', color: 'var(--t2)',
    fontSize: 13, cursor: 'pointer', transition: 'all .15s',
  },
  footer: { marginTop: 24, fontSize: 11, color: 'var(--t3)', textAlign: 'center' },
};

export default function Landing({ onLogin }) {
  const [name, setName] = useState('');

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>
          🔍 <span style={s.logoAccent}>CodeLens</span>
        </div>
        <p style={s.tagline}>
          AI-powered code review agent. Detects security vulnerabilities, bugs,
          performance issues and code smells in seconds — powered by Claude.
        </p>

        <div style={s.features}>
          {[
            ['🔐', 'Security vulnerability detection (SQLi, XSS, secrets)'],
            ['⚡', 'Performance bottleneck analysis (N+1, memory leaks)'],
            ['🐛', 'Bug detection with root cause explanation'],
            ['✍️', 'Actionable fix suggestions with code'],
          ].map(([icon, text]) => (
            <div key={text} style={s.feature}>
              <span style={s.featureIcon}>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        <div style={s.label}>Your Name (optional)</div>
        <input
          style={s.input}
          placeholder="e.g. Alex"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onLogin({ name: name || 'Engineer' })}
          onFocus={e => e.target.style.borderColor = 'var(--acc)'}
          onBlur={e => e.target.style.borderColor = 'var(--border2)'}
        />

        <button style={s.btn}
          onClick={() => onLogin({ name: name || 'Engineer' })}
          onMouseEnter={e => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 8px 24px rgba(99,102,241,.5)'; }}
          onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = '0 4px 16px rgba(99,102,241,.4)'; }}
        >
          Launch CodeLens →
        </button>

        <button style={s.skip}
          onClick={() => onLogin({ name: 'Engineer' })}
          onMouseEnter={e => { e.target.style.background = 'var(--over)'; e.target.style.color = 'var(--t1)'; }}
          onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--t2)'; }}
        >
          Skip → Enter Demo Mode
        </button>
      </div>
      <div style={s.footer}>
        Powered by Claude AI · No backend required · Runs entirely in browser
      </div>
    </div>
  );
}
