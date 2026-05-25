export const SYSTEM_PROMPT = `You are CodeLens, an AI code review agent. Analyze the provided code and return ONLY a valid JSON object. No markdown, no backticks, no explanation — raw JSON only.

IMPORTANT JSON RULES:
- All string values must be on a single line (no newlines inside strings)
- Escape any quotes inside strings with backslash: \"
- Keep all text values short and clean
- No trailing commas
- No comments

Return this exact structure:

{
  "summary": "Brief summary of the PR quality in one sentence.",
  "score": 45,
  "riskLevel": "high",
  "stats": {
    "critical": 2,
    "warnings": 1,
    "suggestions": 1,
    "lgtm": 0
  },
  "categories": {
    "security": 20,
    "performance": 50,
    "codeQuality": 60,
    "maintainability": 55
  },
  "comments": [
    {
      "id": "c1",
      "severity": "critical",
      "category": "Security",
      "file": "src/auth.js",
      "lineRef": "line 5",
      "title": "Hardcoded secret key",
      "description": "The JWT secret is hardcoded in source code. Anyone with repo access can steal tokens.",
      "codeSnippet": "const SECRET = 'my-secret-123';",
      "fix": "const SECRET = process.env.JWT_SECRET;",
      "impact": "High",
      "effort": "Minutes",
      "learnMore": "CWE-798: Use of Hard-coded Credentials"
    }
  ],
  "praisedLines": ["Good use of async/await throughout"],
  "estimatedFixTime": "2-3 hours"
}

Severity rules:
- critical: hardcoded secrets, SQL injection, eval() on input, RCE
- warning: empty catch, N+1 queries, missing error handling
- suggestion: code style, naming, minor improvements
- lgtm: good practices worth noting

Return ONLY the JSON object. Nothing else.`;

const API_URL = 'http://localhost:3001/v1/messages';

export async function callClaude(messages, onChunk) {
  const resp = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      stream: true,
      system: SYSTEM_PROMPT,
      messages,
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`API error ${resp.status}: ${err}`);
  }

  const reader = resp.body.getReader();
  const dec = new TextDecoder();
  let buf = '';
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split('\n');
    buf = lines.pop();
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const d = JSON.parse(line.slice(6));
          if (d.type === 'content_block_delta' && d.delta?.text) {
            fullText += d.delta.text;
            onChunk && onChunk(d.delta.text);
          }
        } catch (_) {}
      }
    }
  }
  return fullText;
}

export function parseReview(raw) {
  // Step 1: strip markdown fences
  let cleaned = raw
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  // Step 2: extract just the JSON object
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start !== -1 && end !== -1) {
    cleaned = cleaned.slice(start, end + 1);
  }

  // Step 3: try direct parse first
  try {
    return JSON.parse(cleaned);
  } catch (e1) {
    // Step 4: fix common issues — unescaped newlines inside strings
    try {
      const fixed = cleaned
        // Replace literal newlines inside strings with space
        .replace(/("(?:[^"\\]|\\.)*")|(\n)/g, (match, str, nl) => {
          if (str) return str; // keep strings intact
          return ' ';          // replace bare newlines with space
        })
        // Remove trailing commas before } or ]
        .replace(/,\s*([}\]])/g, '$1');
      return JSON.parse(fixed);
    } catch (e2) {
      // Step 5: last resort — aggressive sanitize
      try {
        const aggressive = cleaned
          .replace(/\r?\n/g, ' ')
          .replace(/\t/g, ' ')
          .replace(/,\s*([}\]])/g, '$1')
          .replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":'); // unquoted keys
        return JSON.parse(aggressive);
      } catch (e3) {
        // Step 6: return a safe fallback so UI doesn't crash
        console.error('JSON parse failed:', e3.message);
        console.error('Raw response:', raw.slice(0, 500));
        return {
          summary: 'Review completed but response had formatting issues. Try running again.',
          score: 0,
          riskLevel: 'unknown',
          stats: { critical: 0, warnings: 0, suggestions: 0, lgtm: 0 },
          categories: { security: 0, performance: 0, codeQuality: 0, maintainability: 0 },
          comments: [],
          praisedLines: [],
          estimatedFixTime: 'N/A',
        };
      }
    }
  }
}
