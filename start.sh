#!/bin/bash
echo ""
echo "  🔍 CodeLens - Groq Edition"
echo "  ───────────────────────────"
echo ""

if [ -z "$GROQ_API_KEY" ]; then
  echo "  ❌ GROQ_API_KEY is not set!"
  echo ""
  echo "  Get your FREE key at: https://console.groq.com"
  echo "  Then run: export GROQ_API_KEY=your-key-here"
  echo ""
  exit 1
fi

echo "  ✅ API key found"
echo "  Starting proxy + frontend..."
echo ""

cd proxy && node server.js &
PROXY_PID=$!
sleep 1
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "  🌐 Open http://localhost:5173"
echo "  Press Ctrl+C to stop"
echo ""

trap "kill $PROXY_PID $FRONTEND_PID 2>/dev/null" EXIT
wait
