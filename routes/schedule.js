const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET — جدول الموظفين
router.get('/', async (req, res) => {
    const user = req.session?.user;
    if (!user) return res.status(401).json({ error: 'غير مسجل' });

    const month    = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year     = parseInt(req.query.year)  || new Date().getFullYear();
    const branchId = req.query.branchId;

    try {
        const params = [month, year];
        let branchFilter = '';
        if (user.role === 'branch_manager') {
            branchFilter = `AND s.branch_id = $3`;
            params.push(user.branchId);
        } else if (branchId) {
            branchFilter = `AND s.branch_id = $3`;
            params.push(parseInt(branchId));
        }

        const result = await db.query(`
            SELECT s.*, u.name as staff_name, b.name as branch_name
            FROM bank_schedules s
            LEFT JOIN bank_users u ON u.id = s.staff_id
            LEFT JOIN bank_branches b ON b.id = s.branch_id
            WHERE EXTRACT(MONTH FROM s.date) = $1
              AND EXTRACT(YEAR  FROM s.date) = $2
              ${branchFilter}
            ORDER BY s.date, u.name
        `, params);

        res.json(result.rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /summary — ملخص إجازات الموظف
router.get('/summary', async (req, res) => {
    const user = req.session?.user;
    if (!user) return res.status(401).json({ error: 'غير مسجل' });
    try {
        const result = await db.query(`
            SELECT
                u.id, u.name, b.name as branch_name,
                COUNT(CASE WHEN s.status = 'working'  THEN 1 END) as working_days,
                COUNT(CASE WHEN s.status = 'leave'    THEN 1 END) as leave_days,
                COUNT(CASE WHEN s.status = 'sick'     THEN 1 END) as sick_days,
                COUNT(CASE WHEN s.status = 'holiday'  THEN 1 END) as holiday_days
            FROM bank_users u
            LEFT JOIN bank_branches b ON b.id = u.branch_id
            LEFT JOIN bank_schedules s ON s.staff_id = u.id
              AND EXTRACT(YEAR FROM s.date) = EXTRACT(YEAR FROM NOW())
            WHERE u.role IN ('teller', 'branch_manager')
            ${user.role === 'branch_manager' ? `AND u.branch_id = ${parseInt(user.branchId)}` : ''}
            GROUP BY u.id, u.name, b.name
            ORDER BY u.name
        `);
        res.json(result.rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST — إضافة أو تعديل يوم في الجدول
router.post('/', async (req, res) => {
    if (!['admin', 'branch_manager'].includes(req.session?.user?.role))
        return res.json({ success: false, error: 'غير مصرح' });

    const { staffId, branchId, date, status, note } = req.body;
    if (!staffId || !date) return res.json({ success: false, error: 'بيانات ناقصة' });

    try {
        await db.query(`
            INSERT INTO bank_schedules (staff_id, branch_id, date, status, note)
            VALUES ($1,$2,$3,$4,$5)
            ON CONFLICT (staff_id, date) DO UPDATE SET status=$4, note=$5
        `, [parseInt(staffId), branchId ? parseInt(branchId) : null, date, status || 'working', note || '']);

        res.json({ success: true, message: 'تم الحفظ' });
    } catch (err) { res.json({ success: false, error: err.message }); }
});

// DELETE
router.delete('/:id', async (req, res) => {
    if (!['admin', 'branch_manager'].includes(req.session?.user?.role))
        return res.json({ success: false, error: 'غير مصرح' });
    try {
        await db.query('DELETE FROM bank_schedules WHERE id=$1', [req.params.id]);
        res.json({ success: true });
    } catch (err) { res.json({ success: false, error: err.message }); }
});

module.exports = router;
