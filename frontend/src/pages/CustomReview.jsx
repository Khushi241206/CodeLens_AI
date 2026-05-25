import React, { useState } from 'react';
import { callClaude, parseReview } from '../utils/claude.js';
import CommentCard from '../components/CommentCard.jsx';

export default function CustomReview() {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState(null);
  const [error, setError] = useState('');

  const run = async () => {
    if (!code.trim()) return;
    setLoading(true); setError(''); setReview(null);
    let full = '';
    try {
      full = await callClaude([{
        role: 'user',
        content: `Review this code:\n\nTitle: ${title || 'Custom Review'}\n\nCode/Diff:\n${code}`,
      }], () => {});
      setReview(parseReview(full));
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const scoreColor = review ? (review.score >= 70 ? 'var(--grn)' : review.score >= 40 ? 'var(--amb)' : 'var(--red)') : 'var(--t1)';

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <h1 style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-.03em', marginBottom: 4 }}>Custom Code Review</h1>
        <p style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 20 }}>Paste any code or git diff — Claude will analyze it instantly.</p>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 6 }}>Title (optional)</div>
          <input value={title} onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Payment processing refactor"
            style={{ width: '100%', background: 'var(--surf)', border: '1px solid var(--border2)', borderRadius: 8, padding: '10px 13px', color: 'var(--t1)', fontSize: 12, outline: 'none', fontFamily: 'var(--font)' }}
            onFocus={e => e.target.style.borderColor = 'var(--acc)'}
            onBlur={e => e.target.style.borderColor = 'var(--border2)'}
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 6 }}>Code or Git Diff</div>
          <textarea value={code} onChange={e => setCode(e.target.value)}
            rows={12}
            placeholder={`Paste your code or diff here...\n\nExample:\n+async function fetchUser(id) {\n+  const q = 'SELECT * FROM users WHERE id=' + id;\n+  return await db.query(q);\n+}`}
            style={{ width: '100%', background: 'var(--surf)', border: '1px solid var(--border2)', borderRadius: 8, padding: '11px 13px', color: 'var(--t1)', fontSize: 12, fontFamily: 'var(--mono)', resize: 'vertical', outline: 'none', lineHeight: 1.6 }}
            onFocus={e => e.target.style.borderColor = 'var(--acc)'}
            onBlur={e => e.target.style.borderColor = 'var(--border2)'}
          />
        </div>

        <button onClick={run} disabled={loading || !code.trim()} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px',
          borderRadius: 9, border: 'none', cursor: loading || !code.trim() ? 'not-allowed' : 'pointer',
          background: loading || !code.trim() ? 'var(--over)' : 'linear-gradient(135deg, var(--acc), #7c3aed)',
          color: loading || !code.trim() ? 'var(--t3)' : '#fff',
          fontSize: 13, fontWeight: 700, boxShadow: loading || !code.trim() ? 'none' : '0 4px 14px var(--acc-g)',
          transition: 'all .2s',
        }}>
          {loading
            ? <><span style={{ width: 13, height: 13, borderRadius: '50%', border: '2px solid var(--t3)', borderTop: '2px solid #fff', animation: 'spin .8s linear infinite', display: 'inline-block' }} /> Analyzing...</>
            : '▶ Analyze with Claude'
          }
        </button>

        {error && (
          <div style={{ marginTop: 16, padding: 14, background: 'var(--red-d)', border: '1px solid var(--red-b)', borderRadius: 8, fontSize: 12, color: 'var(--red)' }}>
            ⚠ {error}
          </div>
        )}

        {review && (
          <div style={{ marginTop: 22, background: 'var(--surf)', border: '1px solid var(--border)', borderRadius: 11, overflow: 'hidden', animation: 'fadeUp .3s ease' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 30, fontWeight: 900, color: scoreColor, fontFamily: 'var(--mono)' }}>{review.score}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{review.summary}</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {[['Critical', review.stats.critical, 'var(--red)'], ['Warnings', review.stats.warnings, 'var(--amb)'], ['Suggestions', review.stats.suggestions, 'var(--blu)']].map(([l, v, c]) => (
                    <span key={l} style={{ fontSize: 11, color: c, fontFamily: 'var(--mono)' }}><b>{v}</b> {l}</span>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 9 }}>
              {(review.comments || []).map((c, i) => <CommentCard key={i} comment={c} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
