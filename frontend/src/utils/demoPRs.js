export const DEMO_PRS = [
  {
    id: 'demo-1', number: 247,
    title: 'feat: add OAuth2 JWT authentication middleware',
    author: 'priya-kapoor', avatar: 'PK',
    branch: 'feature/oauth2-middleware', baseBranch: 'main',
    repo: 'acme-corp/api-gateway',
    additions: 312, deletions: 47, files: 6,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    diff: `diff --git a/src/middleware/auth.js b/src/middleware/auth.js
+const jwt = require('jsonwebtoken');
+const SECRET = 'my-super-secret-key-123';
+
+async function authMiddleware(req, res, next) {
+  const token = req.query.token || req.headers['authorization'];
+  if (!token) return res.status(401).json({ error: 'No token' });
+  const user = jwt.verify(token, SECRET);
+  req.user = user;
+  for (let i = 0; i < req.user.roles.length; i++) {
+    const role = await db.getRole(req.user.roles[i]);
+    if (role.name === 'admin') req.isAdmin = true;
+  }
+  const userData = await fetch('http://user-service/api/users/' + req.user.id);
+  req.userProfile = await userData.json();
+  next();
+}

diff --git a/src/utils/validation.js b/src/utils/validation.js
+function validateEmail(email) { return email.includes('@'); }
+function sanitizeInput(input) { return input.replace('<','').replace('>',''); }
+function parseUserInput(data) { eval(data.expression); }

diff --git a/src/config/database.js b/src/config/database.js
+const connStr = 'postgresql://admin:Password123@prod-db.internal:5432/appdb';
+module.exports = { connStr };`,
  },
  {
    id: 'demo-2', number: 251,
    title: 'fix: resolve race condition in async job queue',
    author: 'marco-dev', avatar: 'MD',
    branch: 'fix/queue-race', baseBranch: 'main',
    repo: 'acme-corp/worker-service',
    additions: 89, deletions: 54, files: 3,
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    diff: `diff --git a/src/queue/processor.js b/src/queue/processor.js
+async function processQueue() {
+  while (true) {
+    const job = queue.jobs.shift();
+    if (!job) { await sleep(100); continue; }
+    queue.isProcessing = true;
+    try { await processJob(job); } catch(e) {}
+    queue.isProcessing = false;
+  }
+}
+async function processJob(job) {
+  const result = await fetch(job.webhookUrl);
+  const data = result.json();
+  await db.query('UPDATE jobs SET status="done" WHERE id=' + job.id);
+  return data;
+}
+setInterval(processQueue, 0);
+setInterval(processQueue, 0);`,
  },
  {
    id: 'demo-3', number: 255,
    title: 'perf: optimize dashboard aggregation queries',
    author: 'anya-ops', avatar: 'AO',
    branch: 'perf/dashboard-queries', baseBranch: 'develop',
    repo: 'acme-corp/analytics-service',
    additions: 156, deletions: 203, files: 4,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    diff: `diff --git a/src/analytics/dashboard.js b/src/analytics/dashboard.js
+async function getDashboardData(userId, startDate, endDate) {
+  const users = await db.query('SELECT * FROM users');
+  let totalRevenue = 0;
+  for (const user of users) {
+    const orders = await db.query('SELECT * FROM orders WHERE user_id = ' + user.id);
+    for (const order of orders) {
+      const items = await db.query('SELECT * FROM items WHERE order_id = ' + order.id);
+      totalRevenue += items.reduce((sum, i) => sum + i.price, 0);
+    }
+  }
+  const metrics = [];
+  for (let d = startDate; d <= endDate; d.setDate(d.getDate()+1)) {
+    const ds = d.toISOString();
+    const cnt = await db.query('SELECT COUNT(*) FROM events WHERE date="'+ds+'"');
+    metrics.push({ date: ds, count: cnt[0].count });
+  }
+  return { totalRevenue, metrics };
+}`,
  },
  {
    id: 'demo-4', number: 258,
    title: 'feat: add file upload with S3 storage',
    author: 'dev-sam', avatar: 'DS',
    branch: 'feature/s3-upload', baseBranch: 'main',
    repo: 'acme-corp/media-service',
    additions: 201, deletions: 12, files: 5,
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    diff: `diff --git a/src/upload/handler.js b/src/upload/handler.js
+const AWS = require('aws-sdk');
+const s3 = new AWS.S3({
+  accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
+  secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
+  region: 'us-east-1'
+});
+
+app.post('/upload', (req, res) => {
+  const file = req.files.file;
+  const filename = req.body.filename;
+  s3.putObject({
+    Bucket: 'prod-user-uploads',
+    Key: filename,
+    Body: file.data,
+    ACL: 'public-read'
+  }, (err, data) => {
+    if (err) throw err;
+    res.json({ url: 'https://prod-user-uploads.s3.amazonaws.com/' + filename });
+  });
+});`,
  },
];
