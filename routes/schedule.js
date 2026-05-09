const express = require('express');
const router  = express.Router();
const db      = require('../db');

// ── GET /api/schedule — جدول الموظفين للشهر ──────────────────────────────────
router.get('/', async (req, res) => {
    const user = req.session?.user;
    if (!user) return res.status(401).json({ error: 'غير مسجل' });

    const month    = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year     = parseInt(req.query.year)  || new Date().getFullYear();
    const branchId = req.query.branchId;

    try {
        let branchFilter = '';
        const params = [month, year];

        if (user.role === 'branch_manager') {
            branchFilter = `AND (s.branch_id = $3 OR u.branch_id = $3)`;
            params.push(parseInt(user.branchId));
        } else if (user.role === 'teller') {
            branchFilter = `AND s.staff_id = $3`;
            params.push(parseInt(user.id));
        } else if (branchId) {
            branchFilter = `AND (s.branch_id = $3 OR u.branch_id = $3)`;
            params.push(parseInt(branchId));
        }

        const result = await db.query(`
            SELECT s.*, u.name AS staff_name, b.name AS branch_name
            FROM bank_schedules s
            LEFT JOIN bank_users u ON u.id = s.staff_id
            LEFT JOIN bank_branches b ON b.id = COALESCE(s.branch_id, u.branch_id)
            WHERE EXTRACT(MONTH FROM s.date) = $1
              AND EXTRACT(YEAR  FROM s.date) = $2
              ${branchFilter}
            ORDER BY s.date, u.name
        `, params);

        res.json(result.rows);
    } catch (err) {
        console.error('schedule GET error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// ── GET /api/schedule/today — جدول اليوم فقط ─────────────────────────────────
router.get('/today', async (req, res) => {
    const user = req.session?.user;
    if (!user) return res.status(401).json({ error: 'غير مسجل' });

    const today = new Date().toISOString().split('T')[0];
    try {
        let whereExtra = '';
        const params = [today];

        if (user.role === 'branch_manager') {
            whereExtra = `AND (s.branch_id = $2 OR u.branch_id = $2)`;
            params.push(parseInt(user.branchId));
        } else if (user.role === 'teller') {
            whereExtra = `AND s.staff_id = $2`;
            params.push(parseInt(user.id));
        }

        const result = await db.query(`
            SELECT s.*, u.name AS staff_name, u.role AS staff_role,
                   b.name AS branch_name
            FROM bank_schedules s
            LEFT JOIN bank_users u ON u.id = s.staff_id
            LEFT JOIN bank_branches b ON b.id = COALESCE(s.branch_id, u.branch_id)
            WHERE s.date = $1 ${whereExtra}
            ORDER BY u.name
        `, params);

        res.json(result.rows);
    } catch (err) {
        console.error('schedule/today error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// ── GET /api/schedule/summary — ملخص إجازات الموظفين ─────────────────────────
router.get('/summary', async (req, res) => {
    const user = req.session?.user;
    if (!user) return res.status(401).json({ error: 'غير مسجل' });

    const year = parseInt(req.query.year) || new Date().getFullYear();

    try {
        let branchFilter = '';
        const params = [year];

        if (user.role === 'branch_manager') {
            branchFilter = `AND u.branch_id = $2`;
            params.push(parseInt(user.branchId));
        } else if (user.role === 'teller') {
            branchFilter = `AND u.id = $2`;
            params.push(parseInt(user.id));
        }

        const result = await db.query(`
            SELECT
                u.id, u.name, u.role AS staff_role,
                b.name AS branch_name,
                COUNT(CASE WHEN s.status = 'working'  THEN 1 END)::int AS working_days,
                COUNT(CASE WHEN s.status = 'leave'    THEN 1 END)::int AS leave_days,
                COUNT(CASE WHEN s.status = 'sick'     THEN 1 END)::int AS sick_days,
                COUNT(CASE WHEN s.status = 'holiday'  THEN 1 END)::int AS holiday_days
            FROM bank_users u
            LEFT JOIN bank_branches b ON b.id = u.branch_id
            LEFT JOIN bank_schedules s ON s.staff_id = u.id
              AND EXTRACT(YEAR FROM s.date) = $1
            WHERE u.role IN ('teller', 'branch_manager')
            ${branchFilter}
            GROUP BY u.id, u.name, u.role, b.name
            ORDER BY u.name
        `, params);

        res.json(result.rows);
    } catch (err) {
        console.error('schedule/summary error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// ── GET /api/schedule/requests — طلبات الإجازة المعلقة ───────────────────────
router.get('/requests', async (req, res) => {
    const user = req.session?.user;
    if (!user) return res.status(401).json({ error: 'غير مسجل' });

    try {
        let whereExtra = '';
        const params = [];

        if (user.role === 'branch_manager') {
            whereExtra = `AND u.branch_id = $1`;
            params.push(parseInt(user.branchId));
        } else if (user.role === 'teller') {
            whereExtra = `AND r.staff_id = $1`;
            params.push(parseInt(user.id));
        }

        const result = await db.query(`
            SELECT r.*, u.name AS staff_name, b.name AS branch_name
            FROM bank_leave_requests r
            LEFT JOIN bank_users u ON u.id = r.staff_id
            LEFT JOIN bank_branches b ON b.id = u.branch_id
            WHERE 1=1 ${whereExtra}
            ORDER BY r.created_at DESC
            LIMIT 100
        `, params);

        res.json(result.rows);
    } catch (err) {
        // جدول ممكن ميكونش موجود بعد
        if (err.message.includes('does not exist')) return res.json([]);
        res.status(500).json({ error: err.message });
    }
});

// ── POST /api/schedule — إضافة/تعديل يوم (admin & branch_manager) ────────────
router.post('/', async (req, res) => {
    const user = req.session?.user;
    if (!['admin', 'branch_manager'].includes(user?.role))
        return res.json({ success: false, error: 'غير مصرح' });

    const { staffId, branchId, date, status, note } = req.body;
    if (!staffId || !date) return res.json({ success: false, error: 'بيانات ناقصة' });

    try {
        await db.query(`
            INSERT INTO bank_schedules (staff_id, branch_id, date, status, note)
            VALUES ($1,$2,$3,$4,$5)
            ON CONFLICT (staff_id, date) DO UPDATE
            SET status = $4, note = $5, branch_id = COALESCE($2, bank_schedules.branch_id)
        `, [parseInt(staffId), branchId ? parseInt(branchId) : null, date, status || 'working', note || '']);

        res.json({ success: true, message: 'تم الحفظ ✅' });
    } catch (err) {
        console.error('schedule POST error:', err.message);
        res.json({ success: false, error: err.message });
    }
});

// ── POST /api/schedule/request — طلب إجازة من الموظف ────────────────────────
router.post('/request', async (req, res) => {
    const user = req.session?.user;
    if (!user) return res.status(401).json({ error: 'غير مسجل' });

    const { date, type, note } = req.body;
    if (!date || !type) return res.json({ success: false, error: 'بيانات ناقصة' });

    const validTypes = ['leave', 'sick', 'working'];
    if (!validTypes.includes(type)) return res.json({ success: false, error: 'نوع غلط' });

    try {
        // نحاول نعمل الجدول لو مش موجود
        await db.query(`
            CREATE TABLE IF NOT EXISTS bank_leave_requests (
                id SERIAL PRIMARY KEY,
                staff_id INTEGER NOT NULL,
                date DATE NOT NULL,
                type TEXT NOT NULL DEFAULT 'leave',
                note TEXT DEFAULT '',
                status TEXT DEFAULT 'pending',
                reviewed_by TEXT DEFAULT '',
                created_at TIMESTAMP DEFAULT NOW(),
                UNIQUE(staff_id, date)
            )
        `);

        await db.query(`
            INSERT INTO bank_leave_requests (staff_id, date, type, note, status)
            VALUES ($1, $2, $3, $4, 'pending')
            ON CONFLICT (staff_id, date) DO UPDATE
            SET type = $3, note = $4, status = 'pending'
        `, [user.id, date, type, note || '']);

        res.json({ success: true, message: 'تم إرسال الطلب ✅ سيتم مراجعته' });
    } catch (err) {
        console.error('leave request error:', err.message);
        res.json({ success: false, error: err.message });
    }
});

// ── PUT /api/schedule/request/:id — قبول/رفض الطلب (admin & manager) ─────────
router.put('/request/:id', async (req, res) => {
    const user = req.session?.user;
    if (!['admin', 'branch_manager'].includes(user?.role))
        return res.json({ success: false, error: 'غير مصرح' });

    const { action } = req.body; // 'approve' | 'reject'
    if (!['approve', 'reject'].includes(action))
        return res.json({ success: false, error: 'إجراء غير صالح' });

    try {
        // جيب تفاصيل الطلب
        const req_row = await db.query(
            'SELECT * FROM bank_leave_requests WHERE id=$1', [req.params.id]
        );
        if (!req_row.rows.length) return res.json({ success: false, error: 'طلب غير موجود' });
        const r = req_row.rows[0];

        if (action === 'approve') {
            // أضف للجدول الفعلي
            await db.query(`
                INSERT INTO bank_schedules (staff_id, date, status, note)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (staff_id, date) DO UPDATE SET status=$3, note=$4
            `, [r.staff_id, r.date, r.type, r.note || 'تمت الموافقة']);
        }

        await db.query(
            `UPDATE bank_leave_requests SET status=$1, reviewed_by=$2 WHERE id=$3`,
            [action === 'approve' ? 'approved' : 'rejected', user.name || user.username, req.params.id]
        );

        res.json({ success: true, message: action === 'approve' ? 'تمت الموافقة ✅' : 'تم الرفض ❌' });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

// ── DELETE /api/schedule/:id ─────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
    const user = req.session?.user;
    if (!['admin', 'branch_manager'].includes(user?.role))
        return res.json({ success: false, error: 'غير مصرح' });
    try {
        await db.query('DELETE FROM bank_schedules WHERE id=$1', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

module.exports = router;
