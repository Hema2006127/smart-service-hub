const express = require('express');
const router  = express.Router();
const db      = require('../db');

router.get('/', async (req, res) => {
    try {
        const search = req.query.search ? `%${req.query.search}%` : null;
        const result = search
            ? await db.query('SELECT * FROM bank_branches WHERE name ILIKE $1 OR location ILIKE $1 ORDER BY id', [search])
            : await db.query('SELECT * FROM bank_branches ORDER BY id');
        res.json(result.rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
    if (req.session?.user?.role !== 'admin') return res.json({ success: false, error: 'غير مصرح' });
    const { name, location, phone } = req.body;
    if (!name || !location || !phone) return res.json({ success: false, error: 'كل الحقول مطلوبة' });
    try {
        const result = await db.query(
            'INSERT INTO bank_branches (name, location, phone) VALUES ($1,$2,$3) RETURNING *',
            [name, location, phone]
        );
        await db.query('INSERT INTO bank_queue_counters (branch_id, counter) VALUES ($1,0) ON CONFLICT DO NOTHING', [result.rows[0].id]);
        res.json({ success: true, message: 'تم إضافة الفرع ✅', branch: result.rows[0] });
    } catch (err) { res.json({ success: false, error: err.message }); }
});

router.put('/:id', async (req, res) => {
    if (!['admin','branch_manager'].includes(req.session?.user?.role)) return res.json({ success: false, error: 'غير مصرح' });
    const { name, location, phone, status } = req.body;
    try {
        const result = await db.query(
            'UPDATE bank_branches SET name=$1, location=$2, phone=$3, status=$4 WHERE id=$5 RETURNING *',
            [name, location, phone, status||'open', req.params.id]
        );
        res.json({ success: true, message: 'تم التعديل ✅', branch: result.rows[0] });
    } catch (err) { res.json({ success: false, error: err.message }); }
});

router.delete('/:id', async (req, res) => {
    if (req.session?.user?.role !== 'admin') return res.json({ success: false, error: 'غير مصرح' });
    try {
        await db.query('DELETE FROM bank_branches WHERE id=$1', [req.params.id]);
        res.json({ success: true, message: 'تم الحذف 🗑️' });
    } catch (err) { res.json({ success: false, error: err.message }); }
});

module.exports = router;