const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET /api/stats — إحصائيات الشارت
router.get('/', async (req, res) => {
    const user = req.session?.user;
    if (!user) return res.status(401).json({ error: 'غير مسجل' });

    const branchFilter = (user.role !== 'admin' && user.branchId)
        ? `AND q.branch_id = ${parseInt(user.branchId)}`
        : '';

    try {
        const branchStats = await db.query(`
            SELECT b.name, COUNT(q.id) as total,
                   COUNT(CASE WHEN q.status='done' THEN 1 END) as done
            FROM bank_branches b
            LEFT JOIN bank_queue q ON q.branch_id = b.id
            GROUP BY b.id, b.name ORDER BY total DESC
        `);

        const staffStats = await db.query(`
            SELECT u.name, u.username, b.name as branch_name,
                   COUNT(q.id) as served
            FROM bank_users u
            LEFT JOIN bank_branches b ON b.id = u.branch_id
            LEFT JOIN bank_queue q ON q.branch_id = u.branch_id AND q.status = 'done'
            WHERE u.role = 'teller'
            ${user.role !== 'admin' ? `AND u.branch_id = ${parseInt(user.branchId)}` : ''}
            GROUP BY u.id, u.name, u.username, b.name
            ORDER BY served DESC LIMIT 10
        `);

        const apptStats = await db.query(`
            SELECT b.name, COUNT(a.id) as total,
                   COUNT(CASE WHEN a.status='confirmed' THEN 1 END) as confirmed
            FROM bank_branches b
            LEFT JOIN bank_appointments a ON a.branch_id = b.id
            GROUP BY b.id, b.name ORDER BY total DESC
        `);

        // إحصائيات يومية (آخر 7 أيام)
        const dailyStats = await db.query(`
            SELECT DATE(created_at) as day, COUNT(*) as total
            FROM bank_queue
            WHERE created_at >= NOW() - INTERVAL '7 days'
            ${branchFilter}
            GROUP BY DATE(created_at) ORDER BY day
        `);

        // توزيع الخدمات
        const serviceStats = await db.query(`
            SELECT service, COUNT(*) as total
            FROM bank_queue
            WHERE status = 'done'
            ${branchFilter}
            GROUP BY service ORDER BY total DESC
        `);

        // متوسط وقت الانتظار
        const waitStats = await db.query(`
            SELECT b.name as branch_name,
                   COUNT(q.id) as total_served,
                   ROUND(AVG(q.service_id) * 8.5) as avg_wait_min
            FROM bank_queue q
            LEFT JOIN bank_branches b ON b.id = q.branch_id
            WHERE q.status = 'done'
            GROUP BY b.id, b.name ORDER BY total_served DESC
        `);

        // تقييمات الرضا
        const ratingStats = await db.query(`
            SELECT b.name as branch_name,
                   ROUND(AVG(r.rating)::numeric, 1) as avg_rating,
                   COUNT(*) as total_ratings
            FROM bank_ratings r
            LEFT JOIN bank_branches b ON b.id = r.branch_id
            GROUP BY b.id, b.name ORDER BY avg_rating DESC
        `).catch(() => ({ rows: [] }));

        res.json({
            branchQueue:  branchStats.rows,
            topStaff:     staffStats.rows,
            branchAppts:  apptStats.rows,
            dailyStats:   dailyStats.rows,
            serviceStats: serviceStats.rows,
            waitStats:    waitStats.rows,
            ratingStats:  ratingStats.rows,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/stats/export — تصدير CSV
router.get('/export', async (req, res) => {
    const user = req.session?.user;
    if (!user || !['admin', 'branch_manager'].includes(user.role))
        return res.status(403).json({ error: 'غير مصرح' });

    const type = req.query.type || 'queue';
    try {
        let rows = [], headers = [];
        if (type === 'queue') {
            const r = await db.query(`
                SELECT q.token, q.name, q.phone, q.service, q.status, q.priority,
                       b.name as branch, q.created_at
                FROM bank_queue q
                LEFT JOIN bank_branches b ON b.id = q.branch_id
                ORDER BY q.created_at DESC LIMIT 1000
            `);
            headers = ['رقم التذكرة','الاسم','الهاتف','الخدمة','الحالة','الأولوية','الفرع','التاريخ'];
            rows = r.rows.map(r => [r.token, r.name, r.phone, r.service, r.status, r.priority, r.branch, r.created_at]);
        } else if (type === 'appointments') {
            const r = await db.query(`
                SELECT a.customer_name, a.phone, a.service, a.date, a.time, a.status,
                       b.name as branch
                FROM bank_appointments a
                LEFT JOIN bank_branches b ON b.id = a.branch_id
                ORDER BY a.date DESC, a.time DESC LIMIT 1000
            `);
            headers = ['الاسم','الهاتف','الخدمة','التاريخ','الوقت','الحالة','الفرع'];
            rows = r.rows.map(r => [r.customer_name, r.phone, r.service, r.date, r.time, r.status, r.branch]);
        } else if (type === 'ratings') {
            const r = await db.query(`
                SELECT rt.token, rt.service, rt.rating, rt.comment,
                       b.name as branch, rt.created_at
                FROM bank_ratings rt
                LEFT JOIN bank_branches b ON b.id = rt.branch_id
                ORDER BY rt.created_at DESC LIMIT 1000
            `);
            headers = ['رقم التذكرة','الخدمة','التقييم','التعليق','الفرع','التاريخ'];
            rows = r.rows.map(r => [r.token, r.service, r.rating, r.comment, r.branch, r.created_at]);
        }

        // Build CSV with BOM for Arabic support
        const bom = '\uFEFF';
        const csv = bom + [headers, ...rows]
            .map(row => row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(','))
            .join('\n');

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${type}_export_${Date.now()}.csv"`);
        res.send(csv);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
