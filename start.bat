@echo off
echo.
echo  CodeLens - AI Code Review (Groq Edition)
echo  ─────────────────────────────────────────
echo.

if "%GROQ_API_KEY%"=="" (
    echo  ERROR: GROQ_API_KEY is not set!
    echo.
    echo  Get your FREE key at: https://console.groq.com
    echo  Then run:  set GROQ_API_KEY=your-key-here
    echo.
    pause
    exit /b 1
)

echo  Starting proxy server...
start "CodeLens Proxy" cmd /k "cd proxy && node server.js"

timeout /t 2 >nul

echo  Starting frontend...
start "CodeLens Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 3 >nul

echo.
echo  Open http://localhost:5173 in your browser!
echo.
pause
