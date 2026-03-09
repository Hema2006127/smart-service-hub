const express = require('express');
const router  = express.Router();
const db      = require('../db');

router.get('/', async (req, res) => {
    const user = req.session?.user;
    try {
        const result = (user?.role === 'branch_manager' || user?.role === 'teller')
            ? await db.query('SELECT * FROM bank_appointments WHERE branch_id=$1 ORDER BY date, time', [user.branchId])
            : await db.query('SELECT * FROM bank_appointments ORDER BY date, time');
        res.json(result.rows.map(a => ({ ...a, customerName: a.customer_name, branchId: a.branch_id })));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
    const { customerName, phone, service, date, time, branchId } = req.body;
    if (!customerName || !phone || !service || !date || !time || !branchId)
        return res.json({ success: false, error: 'كل الحقول مطلوبة' });
    try {
        const result = await db.query(
            'INSERT INTO bank_appointments (customer_name, phone, service, date, time, branch_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
            [customerName, phone, service, date, time, branchId]
        );
        res.json({ success: true, message: 'تم حجز الموعد', appointment: result.rows[0] });
    } catch (err) { res.json({ success: false, error: err.message }); }
});

// ✏️ تعديل بيانات موعد كاملة
router.put('/:id', async (req, res) => {
    if (!['admin','branch_manager','teller'].includes(req.session?.user?.role)) return res.json({ success: false, error: 'غير مصرح' });
    const { customerName, phone, service, date, time, branchId, status } = req.body;
    if (!customerName || !phone || !service || !date || !time)
        return res.json({ success: false, error: 'كل الحقول مطلوبة' });
    try {
        const result = await db.query(
            'UPDATE bank_appointments SET customer_name=$1, phone=$2, service=$3, date=$4, time=$5, branch_id=$6, status=$7 WHERE id=$8 RETURNING *',
            [customerName, phone, service, date, time, branchId||null, status||'pending', req.params.id]
        );
        if (result.rows.length === 0) return res.json({ success: false, error: 'الموعد غير موجود' });
        const a = result.rows[0];
        res.json({ success: true, message: 'تم تعديل الموعد ✅', appointment: { ...a, customerName: a.customer_name, branchId: a.branch_id } });
    } catch (err) { res.json({ success: false, error: err.message }); }
});

router.put('/:id/status', async (req, res) => {
    try {
        await db.query('UPDATE bank_appointments SET status=$1 WHERE id=$2', [req.body.status, req.params.id]);
        res.json({ success: true, message: 'تم التحديث' });
    } catch (err) { res.json({ success: false, error: err.message }); }
});

router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM bank_appointments WHERE id=$1', [req.params.id]);
        res.json({ success: true, message: 'تم الإلغاء' });
    } catch (err) { res.json({ success: false, error: err.message }); }
});

module.exports = router;