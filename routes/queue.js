const express = require('express');
const router  = express.Router();
const db      = require('../db');

const SERVICES = [
    { id: 1, name: 'فتح حساب جديد', duration: 15 },
    { id: 2, name: 'سحب / إيداع',   duration: 5  },
    { id: 3, name: 'تحويل بنكي',    duration: 10 },
    { id: 4, name: 'طلب بطاقة',     duration: 10 },
    { id: 5, name: 'استفسار عام',   duration: 7  },
];

router.get('/services', (req, res) => res.json(SERVICES));

router.get('/:branchId', async (req, res) => {
    try {
        const result = await db.query(
            "SELECT * FROM bank_queue WHERE branch_id=$1 AND status IN ('waiting','serving') ORDER BY created_at",
            [req.params.branchId]
        );
        res.json(result.rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/:branchId', async (req, res) => {
    const branchId = parseInt(req.params.branchId);
    const { name, serviceId } = req.body;
    const service = SERVICES.find(s => s.id === parseInt(serviceId));
    if (!service) return res.json({ success: false, error: 'الخدمة مش موجودة' });
    try {
        await db.query(
            'INSERT INTO bank_queue_counters (branch_id, counter) VALUES ($1,1) ON CONFLICT (branch_id) DO UPDATE SET counter = bank_queue_counters.counter + 1',
            [branchId]
        );
        const c = await db.query('SELECT counter FROM bank_queue_counters WHERE branch_id=$1', [branchId]);
        const token = 'B' + String(c.rows[0].counter).padStart(3,'0');
        const w = await db.query("SELECT COUNT(*) FROM bank_queue WHERE branch_id=$1 AND status='waiting'", [branchId]);
        const pos = parseInt(w.rows[0].count) + 1;
        await db.query(
            'INSERT INTO bank_queue (token, name, phone, service, service_id, status, branch_id) VALUES ($1,$2,$3,$4,$5,$6,$7)',
            [token, name||'عميل', req.body.phone||'', service.name, service.id, 'waiting', branchId]
        );
        res.json({ success: true, token, position: pos, estimatedWait: pos * 8, message: 'رقمك هو ' + token + ' 🎫' });
    } catch (err) { res.json({ success: false, error: err.message }); }
});

router.put('/:branchId/next', async (req, res) => {
    if (!['teller','branch_manager','admin'].includes(req.session?.user?.role))
        return res.json({ success: false, error: 'غير مصرح' });
    const branchId = parseInt(req.params.branchId);
    try {
        await db.query("UPDATE bank_queue SET status='done' WHERE branch_id=$1 AND status='serving'", [branchId]);
        const next = await db.query(
            "UPDATE bank_queue SET status='serving' WHERE id=(SELECT id FROM bank_queue WHERE branch_id=$1 AND status='waiting' ORDER BY created_at LIMIT 1) RETURNING *",
            [branchId]
        );
        if (!next.rows.length) return res.json({ success: true, message: 'الطابور فاضي', next: null });
        res.json({ success: true, next: next.rows[0], message: 'جاري خدمة ' + next.rows[0].token });
    } catch (err) { res.json({ success: false, error: err.message }); }
});

router.delete('/:branchId/reset', async (req, res) => {
    if (!['branch_manager','admin'].includes(req.session?.user?.role))
        return res.json({ success: false, error: 'غير مصرح' });
    try {
        await db.query("DELETE FROM bank_queue WHERE branch_id=$1", [req.params.branchId]);
        await db.query("UPDATE bank_queue_counters SET counter=0 WHERE branch_id=$1", [req.params.branchId]);
        res.json({ success: true, message: 'تم إعادة تعيين الطابور' });
    } catch (err) { res.json({ success: false, error: err.message }); }
});

module.exports = router;