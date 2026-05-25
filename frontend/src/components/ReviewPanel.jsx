import React, { useState } from 'react';
import CommentCard from './CommentCard.jsx';

const SEV = {
  critical:   { label: 'Critical',   color: 'var(--red)' },
  warning:    { label: 'Warning',    color: 'var(--amb)' },
  suggestion: { label: 'Suggestion', color: 'var(--blu)' },
  lgtm:       { label: 'LGTM',       color: 'var(--grn)' },
};

function ScoreArc({ score }) {
  const r = 32, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 70 ? 'var(--grn)' : score >= 40 ? 'var(--amb)' : 'var(--red)';
  const label = score >= 70 ? 'Good' : score >= 40 ? 'Fair' : 'Poor';
  return (
    <div style={{ position: 'relative', width: 84, height: 84, flexShrink: 0 }}>
      <svg width="84" height="84" style={{ transform: 'rotate(-90deg)', position: 'absolute', top: 0, left: 0 }}>
        <circle cx="42" cy="42" r={r} fill="none" stroke="var(--over)" strokeWidth="5" />
        <circle cx="42" cy="42" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 5px ${color})`, transition: 'stroke-dasharray 1.2s ease' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 21, fontWeight: 900, color, lineHeight: 1, animation: 'scoreIn .5s ease' }}>{score}</span>
        <span style={{ fontSize: 9, color: 'var(--t3)', letterSpacing: '.05em' }}>{label}</span>
      </div>
    </div>
  );
}

function CategoryBar({ label, score }) {
  const color = score >= 70 ? 'var(--grn)' : score >= 40 ? 'var(--amb)' : 'var(--red)';
  return (
    <div style={{ marginBottom: 7 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginBottom: 2 }}>
        <span style={{ color: 'var(--t2)' }}>{label}</span>
        <span style={{ color, fontFamily: 'var(--mono)', fontWeight: 600 }}>{score}</span>
      </div>
      <div style={{ height: 3, background: 'var(--over)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: 2, transition: 'width 1s ease' }} />
      </div>
    </div>
  );
}

function Reviewing({ msg }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: 40 }}>
      <div style={{ position: 'relative', width: 68, height: 68 }}>
        <div style={{ width: 68, height: 68, borderRadius: '50%', border: '3px solid var(--over)', borderTop: '3px solid var(--acc)', animation: 'spin 1s linear infinite' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🤖</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 7 }}>AI Agent Reviewing...</div>
        <div style={{ fontSize: 12, color: 'var(--acc)', fontFamily: 'var(--mono)', minHeight: 18 }}>{msg}</div>
      </div>
      <div style={{ display: 'flex', gap: 5 }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--acc)', animation: `pulse 1.2s ease ${i * 0.2}s infinite` }} />
        ))}
      </div>
      <div style={{ maxWidth: 340, background: 'var(--surf)', border: '1px solid var(--border)', borderRadius: 9, padding: '12px 16px', fontSize: 11, color: 'var(--t2)', lineHeight: 1.7, textAlign: 'center' }}>
        Scanning for security vulnerabilities, performance issues, bugs, and code quality problems...
      </div>
    </div>
  );
}

export default function ReviewPanel({ pr, loading, reviewing, statusMsg, onRunReview }) {
  const [filter, setFilter] = useState('all');

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid var(--over)', borderTop: '3px solid var(--acc)', animation: 'spin .8s linear infinite' }} />
      </div>
    );
  }

  if (!pr) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, animation: 'fadeIn .4s ease' }}>
        <div style={{ fontSize: 44 }}>🤖</div>
        <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-.02em' }}>Select a pull request</div>
        <div style={{ fontSize: 12, color: 'var(--t2)', textAlign: 'center', maxWidth: 330, lineHeight: 1.7 }}>
          Choose a PR from the sidebar. The AI agent will scan it for bugs, security vulnerabilities, performance issues, and code smells.
        </div>
        <div style={{ padding: '6px 14px', background: 'var(--acc-d)', border: '1px solid var(--acc-g)', borderRadius: 18, fontSize: 11, color: 'var(--acc)', fontFamily: 'var(--mono)' }}>
          ⚡ Reviews complete in under 30 seconds
        </div>
      </div>
    );
  }

  const review = pr.review;
  const comments = review?.comments || [];
  const filtered = filter === 'all' ? comments : comments.filter(c => c.severity === filter);
  const riskColors = { critical: 'var(--red)', high: 'var(--red)', medium: 'var(--amb)', low: 'var(--grn)' };
  const riskColor = riskColors[review?.riskLevel] || 'var(--t3)';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'fadeIn .3s ease' }}>
      {/* PR Header */}
      <div style={{ padding: '13px 20px', borderBottom: '1px solid var(--border)', background: 'var(--surf)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--t3)', background: 'var(--over)', padding: '2px 7px', borderRadius: 4, border: '1px solid var(--border)' }}>#{pr.number}</span>
              <span style={{ fontSize: 10, color: 'var(--t3)' }}>{pr.repo}</span>
              <span style={{ color: 'var(--border2)' }}>·</span>
              <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--t3)' }}>{pr.branch} → {pr.baseBranch}</span>
              {review?.riskLevel && (
                <span style={{ fontSize: 10, padding: '1px 7px', borderRadius: 4, background: `${riskColor}20`, color: riskColor, border: `1px solid ${riskColor}30`, fontWeight: 600 }}>
                  {review.riskLevel.toUpperCase()} RISK
                </span>
              )}
            </div>
            <h2 style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-.02em', marginBottom: 5 }}>{pr.title}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 12, color: 'var(--t2)' }}>
              <span>@{pr.author}</span>
              <span style={{ color: 'var(--grn)' }}>+{pr.additions}</span>
              <span style={{ color: 'var(--red)' }}>−{pr.deletions}</span>
              <span>{pr.files} files</span>
              {review?.estimatedFixTime && <span style={{ color: 'var(--t3)' }}>· Fix time: {review.estimatedFixTime}</span>}
            </div>
          </div>
          <button onClick={onRunReview} disabled={reviewing} style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '9px 18px', borderRadius: 8, border: 'none', flexShrink: 0,
            background: reviewing ? 'var(--over)' : 'linear-gradient(135deg, var(--acc), #7c3aed)',
            color: reviewing ? 'var(--t3)' : 'white',
            fontSize: 12, fontWeight: 700, cursor: reviewing ? 'not-allowed' : 'pointer',
            boxShadow: reviewing ? 'none' : '0 4px 14px var(--acc-g)',
            transition: 'all .2s',
          }}>
            {reviewing
              ? <><span style={{ width: 11, height: 11, borderRadius: '50%', border: '2px solid var(--t3)', borderTop: '2px solid #fff', animation: 'spin .8s linear infinite', display: 'inline-block' }} /> Reviewing...</>
              : <>{review ? '↻ Re-run Review' : '▶ Run AI Review'}</>
            }
          </button>
        </div>
      </div>

      {reviewing ? <Reviewing msg={statusMsg} /> : review ? (
        <>
          {/* Stats Bar */}
          <div style={{ padding: '13px 20px', borderBottom: '1px solid var(--border)', background: 'var(--surf)', display: 'flex', gap: 14, alignItems: 'center', flexShrink: 0, flexWrap: 'wrap' }}>
            <ScoreArc score={review.score} />
            <div style={{ flex: 1, minWidth: 180 }}>
              <p style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.75, marginBottom: 10, fontStyle: 'italic', borderLeft: '2px solid var(--acc-d)', paddingLeft: 11 }}>
                {review.summary}
              </p>
              <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                {[
                  { label: 'Critical',    val: review.stats.critical,    color: 'var(--red)', bg: 'var(--red-d)', border: 'var(--red-b)' },
                  { label: 'Warnings',    val: review.stats.warnings,    color: 'var(--amb)', bg: 'var(--amb-d)', border: 'var(--amb-b)' },
                  { label: 'Suggestions', val: review.stats.suggestions, color: 'var(--blu)', bg: 'var(--blu-d)', border: 'var(--blu-b)' },
                  { label: 'LGTM',        val: review.stats.lgtm,        color: 'var(--grn)', bg: 'var(--grn-d)', border: 'var(--grn-b)' },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center', padding: '7px 12px', background: s.bg, border: `1px solid ${s.border}`, borderRadius: 7 }}>
                    <div style={{ fontSize: 19, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.val}</div>
                    <div style={{ fontSize: 9, color: 'var(--t3)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '.06em' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            {review.categories && (
              <div style={{ width: 170, flexShrink: 0 }}>
                <CategoryBar label="Security"        score={review.categories.security} />
                <CategoryBar label="Performance"     score={review.categories.performance} />
                <CategoryBar label="Code Quality"    score={review.categories.codeQuality} />
                <CategoryBar label="Maintainability" score={review.categories.maintainability} />
              </div>
            )}
          </div>

          {/* Filters */}
          <div style={{ padding: '7px 20px', borderBottom: '1px solid var(--border)', background: 'var(--surf)', display: 'flex', gap: 3, flexShrink: 0 }}>
            {['all','critical','warning','suggestion','lgtm'].map(f => {
              const cnt = f === 'all' ? comments.length : comments.filter(c => c.severity === f).length;
              if (f !== 'all' && !cnt) return null;
              const conf = SEV[f] || { label: 'All', color: 'var(--t2)' };
              return (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: '4px 11px', borderRadius: 5, border: 'none', cursor: 'pointer',
                  background: filter === f ? 'var(--over)' : 'transparent',
                  color: filter === f ? 'var(--t1)' : 'var(--t3)',
                  fontSize: 11, fontWeight: filter === f ? 600 : 400,
                  display: 'flex', alignItems: 'center', gap: 4, transition: 'all .12s',
                }}>
                  {f === 'all' ? 'All' : conf.label}
                  <span style={{ fontSize: 10, color: filter === f ? conf.color : 'var(--t3)', background: 'var(--bg)', padding: '0 4px', borderRadius: 3, fontFamily: 'var(--mono)' }}>{cnt}</span>
                </button>
              );
            })}
          </div>

          {/* Comments */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 9 }}>
            {review.praisedLines?.length > 0 && filter === 'all' && (
              <div style={{ padding: '9px 13px', background: 'var(--grn-d)', border: '1px solid var(--grn-b)', borderRadius: 9, fontSize: 12, color: 'var(--grn)' }}>
                ✓ {review.praisedLines[0]}
              </div>
            )}
            {filtered.length === 0
              ? <div style={{ textAlign: 'center', padding: 36, color: 'var(--t3)', fontSize: 12 }}>No issues in this category</div>
              : filtered.map((c, i) => <CommentCard key={c.id || i} comment={c} index={i} />)
            }
          </div>
        </>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <div style={{ fontSize: 33 }}>🔍</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Ready to review</div>
          <div style={{ fontSize: 12, color: 'var(--t2)', textAlign: 'center', maxWidth: 310, lineHeight: 1.7 }}>
            Click "Run AI Review" to detect bugs, security vulnerabilities, and performance issues in this PR.
          </div>
        </div>
      )}
    </div>
  );
}
