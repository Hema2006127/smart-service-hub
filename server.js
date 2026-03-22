require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path    = require('path');
const EventEmitter = require('events');

const authRoutes        = require('./routes/auth');
const branchRoutes      = require('./routes/branches');
const staffRoutes       = require('./routes/staff');
const queueRoutes       = require('./routes/queue');
const appointmentRoutes = require('./routes/appointments');
const statsRoutes       = require('./routes/stats');
const ratingsRoutes     = require('./routes/ratings');
const auditRoutes       = require('./routes/audit');
const scheduleRoutes    = require('./routes/schedule');

const app = express();

// ── SSE Event Bus (shared across routes) ──────────────────────────────────────
const queueEvents = new EventEmitter();
queueEvents.setMaxListeners(200);
app.set('queueEvents', queueEvents);

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: process.env.SESSION_SECRET || 'bank-secret-2024',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 8 * 3600000 }
}));

// ── Audit Log Middleware ──────────────────────────────────────────────────────
const { logAudit } = require('./routes/audit');
app.use((req, _res, next) => {
    const writeOps = ['POST', 'PUT', 'DELETE'];
    if (writeOps.includes(req.method) && req.path.startsWith('/api/') && req.session?.user) {
        const user = req.session.user;
        const action = `${req.method} ${req.path}`;
        const details = JSON.stringify(req.body || {}).slice(0, 300);
        logAudit(user.username, user.role, action, details, req.ip);
    }
    next();
});

// ── Auth Routes ───────────────────────────────────────────────────────────────
app.use('/login', authRoutes);
app.post('/logout', (req, res) => { req.session.destroy(); res.json({ success: true }); });

// ── SSE Endpoint ──────────────────────────────────────────────────────────────
app.get('/api/events/:branchId', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders();

    const branchId = req.params.branchId;

    const listener = (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    queueEvents.on(`branch:${branchId}`, listener);

    // Send heartbeat every 25s to keep connection alive
    const heartbeat = setInterval(() => {
        res.write(`:heartbeat\n\n`);
    }, 25000);

    req.on('close', () => {
        queueEvents.off(`branch:${branchId}`, listener);
        clearInterval(heartbeat);
    });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.get('/api/me', (req, res) => {
    if (!req.session || !req.session.user) return res.status(401).json({ error: 'غير مسجل دخول' });
    res.json(req.session.user);
});

app.use('/api/branches',     branchRoutes);
app.use('/api/staff',        staffRoutes);
app.use('/api/queue',        queueRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/stats',        statsRoutes);
app.use('/api/ratings',      ratingsRoutes);
app.use('/api/audit',        auditRoutes);
app.use('/api/schedule',     scheduleRoutes);

// ── Page Routes ───────────────────────────────────────────────────────────────
app.get('/login',    (req, res) => res.sendFile(path.resolve('public/pages/login.html')));
app.get('/customer', (req, res) => res.sendFile(path.resolve('public/pages/customer.html')));
app.get('/display',  (req, res) => res.sendFile(path.resolve('public/pages/display.html')));
app.get('/teller',   (req, res) => {
    if (!req.session || !req.session.user) return res.redirect('/login');
    res.sendFile(path.resolve('public/pages/teller.html'));
});
app.get('/manager',  (req, res) => {
    if (!req.session || !req.session.user) return res.redirect('/login');
    res.sendFile(path.resolve('public/pages/manager.html'));
});
app.get('/',         (req, res) => {
    if (!req.session || !req.session.user) return res.redirect('/login');
    res.sendFile(path.resolve('public/pages/admin.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Bank System running on http://localhost:' + PORT));
