import React from 'react';

const STATUS = {
  pending:            { color: 'var(--t3)',  dot: '#484d5d', label: 'Pending' },
  'changes-requested':{ color: 'var(--amb)', dot: '#fbbf24', label: 'Changes needed' },
  approved:           { color: 'var(--grn)', dot: '#4ade80', label: 'Approved' },
  rejected:           { color: 'var(--red)', dot: '#f87171', label: 'Rejected' },
};

function PRCard({ pr, selected, onSelect }) {
  const st = STATUS[pr.status] || STATUS.pending;
  return (
    <button onClick={() => onSelect(pr.id)} style={{
      width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer',
      padding: '12px 14px',
      background: selected ? 'var(--over)' : 'transparent',
      borderLeft: `2px solid ${selected ? 'var(--acc)' : 'transparent'}`,
      borderBottom: '1px solid var(--border)',
      transition: 'all .12s',
    }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.background = 'var(--elev)'; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.background = 'transparent'; }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6, marginBottom: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)', lineHeight: 1.45 }}>{pr.title}</span>
        {pr.reviewScore != null && (
          <span style={{
            fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, flexShrink: 0,
            color: pr.reviewScore >= 70 ? 'var(--grn)' : pr.reviewScore >= 40 ? 'var(--amb)' : 'var(--red)',
          }}>{pr.reviewScore}</span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'var(--t3)', marginBottom: 4, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--mono)' }}>#{pr.number}</span>·<span>@{pr.author}</span>
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 3 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: st.dot, display: 'inline-block' }} />
          <span style={{ color: st.color }}>{st.label}</span>
        </span>
      </div>
      <div style={{ display: 'flex', gap: 8, fontSize: 10, fontFamily: 'var(--mono)' }}>
        <span style={{ color: 'var(--grn)' }}>+{pr.additions}</span>
        <span style={{ color: 'var(--red)' }}>−{pr.deletions}</span>
        <span style={{ color: 'var(--t3)' }}>{pr.files} files</span>
        <span style={{ color: 'var(--t3)', marginLeft: 'auto' }}>{pr.repo?.split('/')[1]}</span>
      </div>
    </button>
  );
}

function Skeleton() {
  return (
    <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
      <div className="shimmer" style={{ height: 13, width: '80%', marginBottom: 8 }} />
      <div className="shimmer" style={{ height: 10, width: '55%', marginBottom: 6 }} />
      <div className="shimmer" style={{ height: 10, width: '40%' }} />
    </div>
  );
}

export default function Sidebar({ prs, loading, selectedId, onSelect, onRefresh }) {
  const pending = prs.filter(p => p.status === 'pending').length;
  return (
    <aside style={{
      width: 272, flexShrink: 0,
      background: 'var(--surf)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 10, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.08em' }}>
          Pull Requests
          <span style={{ fontSize: 10, fontFamily: 'var(--mono)', padding: '1px 6px', background: 'var(--over)', border: '1px solid var(--border2)', borderRadius: 4, color: 'var(--t2)' }}>
            {prs.length}
          </span>
          {pending > 0 && (
            <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, background: 'var(--amb-d)', color: 'var(--amb)', border: '1px solid var(--amb-b)' }}>
              {pending} pending
            </span>
          )}
        </div>
        <button onClick={onRefresh} style={{ background: 'none', border: 'none', color: 'var(--t3)', fontSize: 15, padding: '3px 6px', borderRadius: 4, cursor: 'pointer', transition: 'color .15s' }}
          onMouseEnter={e => e.target.style.color = 'var(--t1)'}
          onMouseLeave={e => e.target.style.color = 'var(--t3)'}
          title="Refresh">↻</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {loading
          ? [1,2,3,4].map(i => <Skeleton key={i} />)
          : prs.map((pr, i) => (
            <div key={pr.id} style={{ animation: `slideR .22s ease ${i * 50}ms both` }}>
              <PRCard pr={pr} selected={selectedId === pr.id} onSelect={onSelect} />
            </div>
          ))
        }
      </div>

      <div style={{ padding: '9px 14px', borderTop: '1px solid var(--border)', fontSize: 10, color: 'var(--t3)', textAlign: 'center', fontFamily: 'var(--mono)' }}>
        🟢 Demo mode · Powered by Claude AI
      </div>
    </aside>
  );
}
