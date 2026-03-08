const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET /api/stats — إحصائيات الشارت
router.get('/', async (req, res) => {
    const user = req.session?.user;
    if (!user) return res.status(401).json({ error: 'غير مسجل' });

    try {
        // أكتر فرع شغال (عدد العمليات الكلية في bank_queue)
        const branchStats = await db.query(`
            SELECT b.name, COUNT(q.id) as total
            FROM bank_branches b
            LEFT JOIN bank_queue q ON q.branch_id = b.id
            GROUP BY b.id, b.name
            ORDER BY total DESC
        `);

        // أحسن موظف (عدد العملاء اللي اتخدموا per branch)
        // بما إن مفيش staff_id في bank_queue، هنحسب per branch وبعدين نوزع على الموظفين
        // أو نحسب عدد العملاء اللي خلصوا (status=done) لكل فرع ونعرض top staff per branch
        const staffStats = await db.query(`
            SELECT 
                u.name,
                u.username,
                b.name as branch_name,
                COUNT(q.id) as served
            FROM bank_users u
            LEFT JOIN bank_branches b ON b.id = u.branch_id
            LEFT JOIN bank_queue q ON q.branch_id = u.branch_id AND q.status = 'done'
            WHERE u.role = 'teller'
            ${user.role !== 'admin' ? `AND u.branch_id = ${parseInt(user.branchId)}` : ''}
            GROUP BY u.id, u.name, u.username, b.name
            ORDER BY served DESC
            LIMIT 10
        `);

        // إحصائيات المواعيد per فرع
        const apptStats = await db.query(`
            SELECT b.name, COUNT(a.id) as total
            FROM bank_branches b
            LEFT JOIN bank_appointments a ON a.branch_id = b.id
            GROUP BY b.id, b.name
            ORDER BY total DESC
        `);

        res.json({
            branchQueue:  branchStats.rows,
            topStaff:     staffStats.rows,
            branchAppts:  apptStats.rows,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;