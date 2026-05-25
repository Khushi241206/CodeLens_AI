# 🔍 CodeLens — AI Code Review (Groq Edition)

Powered by **Groq + LLaMA 3.3 70B** — completely free, no credit card needed.

---

## 🆓 Step 1 — Get Your FREE Groq API Key

1. Go to **https://console.groq.com**
2. Sign up with Google or email (free, no credit card)
3. Click **API Keys** in the left sidebar
4. Click **Create API Key** → Copy it

---

## 💻 Step 2 — Set the API Key

**Windows (Command Prompt):**
```cmd
set GROQ_API_KEY=gsk_your-key-here
```

**Mac / Linux:**
```bash
export GROQ_API_KEY=gsk_your-key-here
```

---

## 📦 Step 3 — Install (first time only)

```bash
cd frontend
npm install
cd ..
```

---

## ▶️ Step 4 — Run

### Windows — double-click `start.bat`

### Mac / Linux:
```bash
chmod +x start.sh
./start.sh
```

### Manual (two terminals):

**Terminal 1:**
```bash
cd proxy
node server.js
```

**Terminal 2:**
```bash
cd frontend
npm run dev
```

Open **http://localhost:5173** 🎉

---

## ❓ Troubleshooting

| Error | Fix |
|-------|-----|
| `Failed to fetch` | Start the proxy: `cd proxy && node server.js` |
| `GROQ_API_KEY not set` | Run `set GROQ_API_KEY=gsk_...` first |
| `npm not found` | Install Node.js from https://nodejs.org |
| Port already in use | Restart your terminal and try again |
