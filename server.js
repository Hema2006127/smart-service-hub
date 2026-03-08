require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path    = require('path');

const authRoutes        = require('./routes/auth');
const branchRoutes      = require('./routes/branches');
const staffRoutes       = require('./routes/staff');
const queueRoutes       = require('./routes/queue');
const appointmentRoutes = require('./routes/appointments');
const statsRoutes       = require('./routes/stats');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: process.env.SESSION_SECRET || 'bank-secret-2024',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 8 * 3600000 }
}));

app.use('/login', authRoutes);
app.post('/logout', (req, res) => { req.session.destroy(); res.json({ success: true }); });

app.get('/api/me', (req, res) => {
    if (!req.session || !req.session.user) return res.status(401).json({ error: 'غير مسجل دخول' });
    res.json(req.session.user);
});

app.use('/api/branches',     branchRoutes);
app.use('/api/staff',        staffRoutes);
app.use('/api/queue',        queueRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/stats',        statsRoutes);

app.get('/login',    (req, res) => res.sendFile(path.resolve('public/pages/login.html')));
app.get('/customer', (req, res) => res.sendFile(path.resolve('public/pages/customer.html')));
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