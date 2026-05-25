import React from 'react';

function StatCard({ icon, val, label, hint, color }) {
  return (
    <div style={{ background: 'var(--surf)', border: '1px solid var(--border)', borderRadius: 11, padding: '18px 20px' }}>
      <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-.03em', lineHeight: 1, marginBottom: 3, color: color || 'var(--t1)' }}>{val}</div>
      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 10, color: 'var(--t3)' }}>{hint}</div>
    </div>
  );
}

export default function Analytics({ prs }) {
  const reviewed = prs.filter(p => p.review);
  const avgScore = reviewed.length ? Math.round(reviewed.reduce((s, p) => s + (p.review.score || 0), 0) / reviewed.length) : 0;
  const criticalFound = reviewed.reduce((s, p) => s + (p.review?.stats?.critical || 0), 0);
  const secIssues = reviewed.reduce((s, p) => s + (p.review?.comments?.filter(c => c.category === 'Security').length || 0), 0);
  const approved = prs.filter(p => p.status === 'approved').length;
  const pending = prs.filter(p => p.status === 'pending').length;
  const scoreColor = avgScore >= 70 ? 'var(--grn)' : avgScore >= 40 ? 'var(--amb)' : 'var(--red)';

  const statusColors = {
    pending: 'var(--t3)',
    approved: 'var(--grn)',
    'changes-requested': 'var(--amb)',
    rejected: 'var(--red)',
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-.03em', marginBottom: 4 }}>Analytics</h1>
        <p style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 22 }}>Code quality metrics and review activity across all pull requests.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(148px, 1fr))', gap: 12, marginBottom: 26 }}>
          <StatCard icon="📊" label="Total Reviewed" val={reviewed.length} hint="Pull requests analyzed" />
          <StatCard icon="📈" label="Avg Quality Score" val={reviewed.length ? avgScore : '—'} hint="Out of 100" color={reviewed.length ? scoreColor : 'var(--t3)'} />
          <StatCard icon="🔴" label="Critical Issues" val={criticalFound} hint="Found before merge" color={criticalFound > 0 ? 'var(--red)' : 'var(--grn)'} />
          <StatCard icon="🔐" label="Security Issues" val={secIssues} hint="Vulnerabilities caught" color={secIssues > 0 ? 'var(--amb)' : 'var(--grn)'} />
          <StatCard icon="✅" label="Approved PRs" val={approved} hint="Score ≥ 70" color="var(--grn)" />
          <StatCard icon="⏳" label="Pending Review" val={pending} hint="Awaiting analysis" color="var(--t3)" />
        </div>

        <div style={{ background: 'var(--surf)', border: '1px solid var(--border)', borderRadius: 11, overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.08em' }}>
            Pull Request Overview
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['PR', 'Title', 'Author', 'Score', 'Status', '+/−'].map(h => (
                  <th key={h} style={{ padding: '7px 13px', textAlign: 'left', fontSize: 10, color: 'var(--t3)', fontWeight: 600, letterSpacing: '.05em', borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {prs.map((pr, i) => {
                const sc = pr.review?.score ?? null;
                const scc = sc === null ? 'var(--t3)' : sc >= 70 ? 'var(--grn)' : sc >= 40 ? 'var(--amb)' : 'var(--red)';
                return (
                  <tr key={pr.id} style={{ borderBottom: i < prs.length - 1 ? '1px solid var(--border)' : 'none' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--elev)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '9px 13px', fontFamily: 'var(--mono)', color: 'var(--t3)', fontSize: 12 }}>#{pr.number}</td>
                    <td style={{ padding: '9px 13px', fontSize: 12 }}>
                      <div style={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pr.title}</div>
                      <div style={{ fontSize: 10, color: 'var(--t3)' }}>{pr.repo}</div>
                    </td>
                    <td style={{ padding: '9px 13px', fontSize: 12, color: 'var(--t2)' }}>@{pr.author}</td>
                    <td style={{ padding: '9px 13px', fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 14, color: scc }}>{sc !== null ? sc : '—'}</td>
                    <td style={{ padding: '9px 13px', color: statusColors[pr.status] || 'var(--t3)', fontWeight: 600, fontSize: 11 }}>{pr.status}</td>
                    <td style={{ padding: '9px 13px', fontFamily: 'var(--mono)', fontSize: 12 }}>
                      <span style={{ color: 'var(--grn)' }}>+{pr.additions}</span> <span style={{ color: 'var(--red)' }}>−{pr.deletions}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ padding: '13px 16px', background: 'var(--acc-d)', border: '1px solid var(--acc-g)', borderRadius: 11, fontSize: 12, color: 'var(--acc)', lineHeight: 1.7 }}>
          💡 <b>How it works:</b> Click any PR → Run AI Review. Claude analyzes the diff for security vulnerabilities, bugs, performance issues, and code smells — then generates actionable comments with fixes. No backend or API key required.
        </div>
      </div>
    </div>
  );
}
