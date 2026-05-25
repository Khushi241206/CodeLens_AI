import React, { useState } from 'react';

const SEV = {
  critical:   { label: 'Critical',   color: 'var(--red)', bg: 'var(--red-d)',  border: 'var(--red-b)',  left: '#f87171', icon: '⚠' },
  warning:    { label: 'Warning',    color: 'var(--amb)', bg: 'var(--amb-d)',  border: 'var(--amb-b)',  left: '#fbbf24', icon: '◈' },
  suggestion: { label: 'Suggestion', color: 'var(--blu)', bg: 'var(--blu-d)', border: 'var(--blu-b)',  left: '#60a5fa', icon: '◎' },
  lgtm:       { label: 'LGTM',       color: 'var(--grn)', bg: 'var(--grn-d)', border: 'var(--grn-b)',  left: '#4ade80', icon: '✓' },
};
const IMPACT = {
  High:   { color: 'var(--red)', bg: 'var(--red-d)' },
  Medium: { color: 'var(--amb)', bg: 'var(--amb-d)' },
  Low:    { color: 'var(--blu)', bg: 'var(--blu-d)' },
};

export default function CommentCard({ comment, index }) {
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const s = SEV[comment.severity] || SEV.suggestion;
  const imp = IMPACT[comment.impact] || {};

  const copyFix = async () => {
    if (comment.fix) {
      await navigator.clipboard.writeText(comment.fix).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{
      border: `1px solid ${s.border}`, borderLeft: `3px solid ${s.left}`,
      borderRadius: 9, background: 'var(--surf)', overflow: 'hidden',
      animation: `fadeUp .3s ease ${index * 0.04}s both`,
    }}>
      {/* Header */}
      <div onClick={() => setOpen(!open)} style={{
        display: 'flex', alignItems: 'center', gap: 7, padding: '8px 13px',
        cursor: 'pointer', background: s.bg, userSelect: 'none', flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 13, color: s.color }}>{s.icon}</span>
        <span style={{
          fontSize: 10, fontWeight: 700, color: s.color,
          padding: '1px 6px', background: `${s.color}18`,
          borderRadius: 4, border: `1px solid ${s.border}`,
          textTransform: 'uppercase', letterSpacing: '.06em', fontFamily: 'var(--mono)',
        }}>{s.label}</span>
        <span style={{ fontSize: 10, color: 'var(--t3)', background: 'var(--over)', padding: '1px 6px', borderRadius: 4 }}>
          {comment.category}
        </span>
        {comment.impact && (
          <span style={{ fontSize: 10, color: imp.color, background: imp.bg, padding: '1px 6px', borderRadius: 4 }}>
            {comment.impact} impact
          </span>
        )}
        {comment.effort && (
          <span style={{ fontSize: 10, color: 'var(--t3)', background: 'var(--elev)', padding: '1px 6px', borderRadius: 4 }}>
            ⏱ {comment.effort}
          </span>
        )}
        <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: 'var(--t1)', minWidth: 100 }}>{comment.title}</span>
        <span style={{ fontSize: 10, color: 'var(--t3)', fontFamily: 'var(--mono)' }}>
          {comment.file}{comment.lineRef ? ` · ${comment.lineRef}` : ''}
        </span>
        <span style={{ color: 'var(--t3)', fontSize: 11, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .18s' }}>▾</span>
      </div>

      {open && (
        <div style={{ padding: '11px 13px', display: 'flex', flexDirection: 'column', gap: 9 }}>
          <p style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.75 }}>{comment.description}</p>

          {comment.codeSnippet && (
            <div>
              <div style={{ fontSize: 9, color: 'var(--t3)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                Problematic code
              </div>
              <pre style={{
                background: 'var(--bg)', border: '1px solid var(--red-b)',
                borderRadius: 6, padding: '9px 13px', fontFamily: 'var(--mono)',
                fontSize: 11, color: 'var(--red)', lineHeight: 1.7,
                overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all', margin: 0,
              }}>{comment.codeSnippet}</pre>
            </div>
          )}

          {comment.fix && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <div style={{ fontSize: 9, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                  Suggested fix
                </div>
                <button onClick={copyFix} style={{
                  fontSize: 10, color: copied ? 'var(--grn)' : 'var(--t3)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--mono)', padding: '2px 5px', borderRadius: 3, transition: 'color .12s',
                }}>
                  {copied ? '✓ Copied!' : '⎘ Copy fix'}
                </button>
              </div>
              <pre style={{
                background: 'var(--bg)',
                border: '1px solid var(--grn-b)', borderLeft: '2px solid var(--grn)',
                borderRadius: 6, padding: '9px 13px', fontFamily: 'var(--mono)',
                fontSize: 11, color: 'var(--grn)', lineHeight: 1.7,
                overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all', margin: 0,
              }}>{comment.fix}</pre>
            </div>
          )}

          {comment.learnMore && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              fontSize: 10, color: 'var(--t3)', padding: '5px 9px',
              background: 'var(--elev)', borderRadius: 5,
              border: '1px solid var(--border)', fontFamily: 'var(--mono)',
            }}>
              ℹ {comment.learnMore}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
