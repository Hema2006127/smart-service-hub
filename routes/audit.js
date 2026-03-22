const express = require('express');
const router  = express.Router();
const db      = require('../db');

// Helper exported for use in server.js middleware
async function logAudit(username, role, action, details, ip) {
    try {
        await db.query(
            'INSERT INTO bank_audit_log (username, role, action, details, ip) VALUES ($1,$2,$3,$4,$5)',
            [username || 'system', role || '', action, details || '', ip || '']
        );
    } catch (_) {}
}

// GET — سجل العمليات
router.get('/', async (req, res) => {
    const user = req.session?.user;
    if (!user || !['admin', 'branch_manager'].includes(user.role))
        return res.status(403).json({ error: 'غير مصرح' });

    const page  = parseInt(req.query.page) || 1;
    const limit = 50;
    const offset = (page - 1) * limit;
    const search = req.query.search ? `%${req.query.search}%` : null;

    try {
        let result, countResult;
        if (search) {
            result = await db.query(
                'SELECT * FROM bank_audit_log WHERE username ILIKE $1 OR action ILIKE $1 OR details ILIKE $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
                [search, limit, offset]
            );
            countResult = await db.query(
                'SELECT COUNT(*) FROM bank_audit_log WHERE username ILIKE $1 OR action ILIKE $1 OR details ILIKE $1',
                [search]
            );
        } else {
            result = await db.query(
                'SELECT * FROM bank_audit_log ORDER BY created_at DESC LIMIT $1 OFFSET $2',
                [limit, offset]
            );
            countResult = await db.query('SELECT COUNT(*) FROM bank_audit_log');
        }
        res.json({ logs: result.rows, total: parseInt(countResult.rows[0].count), page });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE — حذف السجلات القديمة (admin فقط)
router.delete('/clear', async (req, res) => {
    if (req.session?.user?.role !== 'admin') return res.status(403).json({ error: 'غير مصرح' });
    try {
        await db.query("DELETE FROM bank_audit_log WHERE created_at < NOW() - INTERVAL '30 days'");
        res.json({ success: true, message: 'تم حذف السجلات الأقدم من 30 يوم' });
    } catch (err) { res.json({ success: false, error: err.message }); }
});

module.exports = router;
module.exports.logAudit = logAudit;
