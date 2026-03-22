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

// Helper to emit SSE events
function emit(req, branchId, type, payload) {
    try {
        const events = req.app.get('queueEvents');
        if (events) events.emit(`branch:${branchId}`, { type, ...payload });
    } catch (_) {}
}

router.get('/services', (_req, res) => res.json(SERVICES));

router.get('/:branchId', async (req, res) => {
    try {
        const result = await db.query(
            "SELECT * FROM bank_queue WHERE branch_id=$1 AND status IN ('waiting','serving') ORDER BY priority DESC, created_at",
            [req.params.branchId]
        );
        res.json(result.rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/:branchId', async (req, res) => {
    const branchId = parseInt(req.params.branchId);
    const { name, serviceId, priority } = req.body;
    const service = SERVICES.find(s => s.id === parseInt(serviceId));
    if (!service) return res.json({ success: false, error: 'الخدمة مش موجودة' });

    // Priority weights: vip=3, elderly/disabled=2, normal=1
    const validPriorities = ['normal', 'elderly', 'disabled', 'vip'];
    const ticketPriority = validPriorities.includes(priority) ? priority : 'normal';
    const priorityWeight = ticketPriority === 'vip' ? 3 : ticketPriority !== 'normal' ? 2 : 1;

    try {
        await db.query(
            'INSERT INTO bank_queue_counters (branch_id, counter) VALUES ($1,1) ON CONFLICT (branch_id) DO UPDATE SET counter = bank_queue_counters.counter + 1',
            [branchId]
        );
        const c = await db.query('SELECT counter FROM bank_queue_counters WHERE branch_id=$1', [branchId]);
        const token = 'B' + String(c.rows[0].counter).padStart(3,'0');
        const w = await db.query("SELECT COUNT(*) FROM bank_queue WHERE branch_id=$1 AND status='waiting'", [branchId]);
        const pos = parseInt(w.rows[0].count) + 1;
        const inserted = await db.query(
            'INSERT INTO bank_queue (token, name, phone, service, service_id, status, branch_id, priority) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
            [token, name||'عميل', req.body.phone||'', service.name, service.id, 'waiting', branchId, priorityWeight]
        );
        emit(req, branchId, 'new_ticket', { token, name: name||'عميل', service: service.name, priority: ticketPriority });
        res.json({ success: true, token, position: pos, estimatedWait: pos * service.duration, message: 'رقمك هو ' + token + ' 🎫', queueId: inserted.rows[0].id });
    } catch (err) { res.json({ success: false, error: err.message }); }
});

router.put('/:branchId/next', async (req, res) => {
    if (!['teller','branch_manager','admin'].includes(req.session?.user?.role))
        return res.json({ success: false, error: 'غير مصرح' });
    const branchId = parseInt(req.params.branchId);
    try {
        await db.query("UPDATE bank_queue SET status='done' WHERE branch_id=$1 AND status='serving'", [branchId]);
        const next = await db.query(
            "UPDATE bank_queue SET status='serving' WHERE id=(SELECT id FROM bank_queue WHERE branch_id=$1 AND status='waiting' ORDER BY priority DESC, created_at LIMIT 1) RETURNING *",
            [branchId]
        );
        if (!next.rows.length) {
            emit(req, branchId, 'queue_empty', {});
            return res.json({ success: true, message: 'الطابور فاضي', next: null });
        }
        emit(req, branchId, 'now_serving', { token: next.rows[0].token, name: next.rows[0].name, service: next.rows[0].service });
        res.json({ success: true, next: next.rows[0], message: 'جاري خدمة ' + next.rows[0].token });
    } catch (err) { res.json({ success: false, error: err.message }); }
});

// GET escalated cases for a branch (manager view)
router.get('/:branchId/escalated', async (req, res) => {
    try {
        const result = await db.query(
            "SELECT * FROM bank_queue WHERE branch_id=$1 AND status='escalated' ORDER BY created_at",
            [req.params.branchId]
        );
        res.json(result.rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Teller: complete current service
router.put('/:id/complete', async (req, res) => {
    if (!['teller','branch_manager','admin'].includes(req.session?.user?.role))
        return res.json({ success: false, error: 'غير مصرح' });
    try {
        const result = await db.query(
            "UPDATE bank_queue SET status='done' WHERE id=$1 RETURNING *",
            [req.params.id]
        );
        if (!result.rows.length) return res.json({ success: false, error: 'الرقم غير موجود' });
        const row = result.rows[0];
        emit(req, row.branch_id, 'ticket_done', { token: row.token });
        res.json({ success: true, message: 'تم إنهاء الخدمة ✅' });
    } catch (err) { res.json({ success: false, error: err.message }); }
});

// Teller: escalate case to manager
router.put('/:id/escalate', async (req, res) => {
    if (!['teller','branch_manager','admin'].includes(req.session?.user?.role))
        return res.json({ success: false, error: 'غير مصرح' });
    try {
        const result = await db.query(
            "UPDATE bank_queue SET status='escalated' WHERE id=$1 RETURNING *",
            [req.params.id]
        );
        if (!result.rows.length) return res.json({ success: false, error: 'الرقم غير موجود' });
        const row = result.rows[0];
        emit(req, row.branch_id, 'escalated', { token: row.token, name: row.name, service: row.service });
        res.json({ success: true, message: 'تم إحالة العميل للمدير ⬆️' });
    } catch (err) { res.json({ success: false, error: err.message }); }
});

// Manager: resolve escalated case
router.put('/:id/resolve', async (req, res) => {
    if (!['branch_manager','admin'].includes(req.session?.user?.role))
        return res.json({ success: false, error: 'غير مصرح' });
    try {
        const result = await db.query(
            "UPDATE bank_queue SET status='done' WHERE id=$1 AND status='escalated' RETURNING *",
            [req.params.id]
        );
        if (!result.rows.length) return res.json({ success: false, error: 'الحالة غير موجودة أو تمت معالجتها' });
        const row = result.rows[0];
        emit(req, row.branch_id, 'ticket_done', { token: row.token });
        res.json({ success: true, message: 'تم حل الحالة ✅' });
    } catch (err) { res.json({ success: false, error: err.message }); }
});

// Manager: send back escalated case to teller
router.put('/:id/sendback', async (req, res) => {
    if (!['branch_manager','admin'].includes(req.session?.user?.role))
        return res.json({ success: false, error: 'غير مصرح' });
    try {
        const result = await db.query(
            "UPDATE bank_queue SET status='serving' WHERE id=$1 AND status='escalated' RETURNING *",
            [req.params.id]
        );
        if (!result.rows.length) return res.json({ success: false, error: 'الحالة غير موجودة' });
        const row = result.rows[0];
        emit(req, row.branch_id, 'sendback', { token: row.token, name: row.name });
        res.json({ success: true, message: 'تم إرجاع العميل للموظف ↩️' });
    } catch (err) { res.json({ success: false, error: err.message }); }
});

router.delete('/:branchId/reset', async (req, res) => {
    if (!['branch_manager','admin'].includes(req.session?.user?.role))
        return res.json({ success: false, error: 'غير مصرح' });
    try {
        await db.query("DELETE FROM bank_queue WHERE branch_id=$1", [req.params.branchId]);
        await db.query("UPDATE bank_queue_counters SET counter=0 WHERE branch_id=$1", [req.params.branchId]);
        emit(req, parseInt(req.params.branchId), 'queue_reset', {});
        res.json({ success: true, message: 'تم إعادة تعيين الطابور' });
    } catch (err) { res.json({ success: false, error: err.message }); }
});

module.exports = router;
