import React, { useState, useCallback } from 'react';
import Header from '../components/Header.jsx';
import Sidebar from '../components/Sidebar.jsx';
import ReviewPanel from '../components/ReviewPanel.jsx';
import CustomReview from './CustomReview.jsx';
import Analytics from './Analytics.jsx';
import { DEMO_PRS } from '../utils/demoPRs.js';
import { callClaude, parseReview } from '../utils/claude.js';

function getStatus(pr) {
  if (!pr.review) return 'pending';
  return pr.review.score >= 70 ? 'approved' : pr.review.score >= 40 ? 'changes-requested' : 'rejected';
}

const REVIEW_MESSAGES = [
  '🔍 Reading diff and identifying changed files...',
  '🧠 Running security vulnerability scan...',
  '⚡ Analyzing performance bottlenecks...',
  '🔬 Checking code quality and patterns...',
  '✍️ Generating actionable review comments...',
];

export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('prs');
  const [prs, setPrs] = useState(DEMO_PRS.map(p => ({ ...p, review: null, status: 'pending' })));
  const [selectedId, setSelectedId] = useState(null);
  const [reviewing, setReviewing] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const selectedPr = prs.find(p => p.id === selectedId) || null;

  const reviewed = prs.filter(p => p.review);
  const avgScore = reviewed.length ? Math.round(reviewed.reduce((s, p) => s + p.review.score, 0) / reviewed.length) : 0;

  const runReview = useCallback(async () => {
    if (!selectedId || reviewing) return;
    const pr = prs.find(p => p.id === selectedId);
    if (!pr) return;

    setReviewing(true);
    setStatusMsg(REVIEW_MESSAGES[0]);

    let msgIdx = 0;
    const ticker = setInterval(() => {
      msgIdx = Math.min(msgIdx + 1, REVIEW_MESSAGES.length - 1);
      setStatusMsg(REVIEW_MESSAGES[msgIdx]);
      if (msgIdx >= REVIEW_MESSAGES.length - 1) clearInterval(ticker);
    }, 600);

    let result = null;
    try {
      const raw = await callClaude([{
        role: 'user',
        content: `Review this pull request:\n\nTitle: ${pr.title}\nAuthor: @${pr.author}\nRepository: ${pr.repo}\nBranch: ${pr.branch} → ${pr.baseBranch}\nFiles changed: ${pr.files} | +${pr.additions} -${pr.deletions}\n\nDiff:\n${pr.diff}`,
      }], () => {});
      result = parseReview(raw);
    } catch (e) {
      result = {
        summary: 'Review failed: ' + e.message,
        score: 0, riskLevel: 'high',
        stats: { critical: 0, warnings: 0, suggestions: 0, lgtm: 0 },
        categories: { security: 0, performance: 0, codeQuality: 0, maintainability: 0 },
        comments: [], praisedLines: [], estimatedFixTime: 'N/A',
      };
    }

    clearInterval(ticker);
    setPrs(prev => prev.map(p => {
      if (p.id !== selectedId) return p;
      const updated = { ...p, review: result };
      updated.status = getStatus(updated);
      updated.reviewScore = result.score;
      return updated;
    }));
    setReviewing(false);
    setStatusMsg('');
  }, [selectedId, reviewing, prs]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header
        user={user}
        onLogout={onLogout}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        stats={{ total: reviewed.length, avgScore }}
      />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {activeTab === 'prs' && (
          <>
            <Sidebar
              prs={prs}
              loading={false}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onRefresh={() => setPrs(DEMO_PRS.map(p => ({ ...p, review: null, status: 'pending' })))}
            />
            <ReviewPanel
              pr={selectedPr}
              loading={false}
              reviewing={reviewing && selectedId === selectedPr?.id}
              statusMsg={statusMsg}
              onRunReview={runReview}
            />
          </>
        )}
        {activeTab === 'custom' && <CustomReview />}
        {activeTab === 'stats' && <Analytics prs={prs} />}
      </div>
    </div>
  );
}
