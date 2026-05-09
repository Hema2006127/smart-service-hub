const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET — كل الموظفين
router.get('/', async (req, res) => {
    const user = req.session?.user;
    if (!user) return res.status(401).json({ error: 'غير مسجل' });
    try {
        const result = user.role === 'branch_manager'
            ? await db.query('SELECT * FROM bank_users WHERE branch_id=$1 ORDER BY id', [user.branchId])
            : await db.query('SELECT * FROM bank_users ORDER BY id');
        res.json(result.rows.map(u => ({ ...u, password: undefined, branchId: u.branch_id })));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST — إضافة موظف
router.post('/', async (req, res) => {
    const callerRole = req.session?.user?.role;
    if (!['admin','branch_manager'].includes(callerRole))
        return res.json({ success: false, error: 'غير مصرح' });

    const { name, username, password, role, branchId } = req.body;
    if (!name || !username) return res.json({ success: false, error: 'الاسم واسم المستخدم مطلوبان' });

    // المدير يمكنه فقط إضافة موظفين (teller)
    if (callerRole === 'branch_manager' && role && role !== 'teller')
        return res.json({ success: false, error: 'مدير الفرع يمكنه إضافة موظفين فقط' });

    const finalPassword = (password && password.trim() !== '') ? password.trim() : 'teller123';

    try {
        const result = await db.query(
            'INSERT INTO bank_users (name, username, password, role, branch_id) VALUES ($1,$2,$3,$4,$5) RETURNING *',
            [name, username, finalPassword, role || 'teller', branchId || null]
        );
        res.json({ success: true, message: `تم إضافة ${name} ✅ (كلمة السر: ${finalPassword})`, member: result.rows[0] });
    } catch (err) {
        if (err.code === '23505') return res.json({ success: false, error: 'اسم المستخدم موجود بالفعل' });
        res.json({ success: false, error: err.message });
    }
});

// PUT — تعديل موظف
router.put('/:id', async (req, res) => {
    const callerRole = req.session?.user?.role;
    if (!['admin','branch_manager'].includes(callerRole))
        return res.json({ success: false, error: 'غير مصرح' });

    const { name, username, role, branchId, password } = req.body;
    if (!name || !username) return res.json({ success: false, error: 'الاسم واسم المستخدم مطلوبان' });

    try {
        // مدير الفرع يمكنه تعديل موظفين (teller) فقط
        if (callerRole === 'branch_manager') {
            const target = await db.query('SELECT role FROM bank_users WHERE id=$1', [req.params.id]);
            if (!target.rows.length) return res.json({ success: false, error: 'الموظف غير موجود' });
            if (target.rows[0].role !== 'teller')
                return res.json({ success: false, error: 'لا يمكنك تعديل هذا المستخدم' });
            if (role && role !== 'teller')
                return res.json({ success: false, error: 'لا يمكنك تغيير الدور' });
        }

        let result;
        if (password && password.trim() !== '') {
            result = await db.query(
                'UPDATE bank_users SET name=$1, username=$2, role=$3, branch_id=$4, password=$5 WHERE id=$6 RETURNING *',
                [name, username, role || 'teller', branchId || null, password.trim(), req.params.id]
            );
        } else {
            result = await db.query(
                'UPDATE bank_users SET name=$1, username=$2, role=$3, branch_id=$4 WHERE id=$5 RETURNING *',
                [name, username, role || 'teller', branchId || null, req.params.id]
            );
        }
        if (!result.rows.length) return res.json({ success: false, error: 'الموظف غير موجود' });
        res.json({ success: true, message: 'تم التعديل ✅', member: { ...result.rows[0], password: undefined } });
    } catch (err) {
        if (err.code === '23505') return res.json({ success: false, error: 'اسم المستخدم موجود بالفعل' });
        res.json({ success: false, error: err.message });
    }
});

// DELETE — حذف موظف
router.delete('/:id', async (req, res) => {
    const callerRole = req.session?.user?.role;
    if (!['admin','branch_manager'].includes(callerRole))
        return res.json({ success: false, error: 'غير مصرح' });
    try {
        // مدير الفرع يمكنه حذف موظفين (teller) فقط
        if (callerRole === 'branch_manager') {
            const target = await db.query('SELECT role FROM bank_users WHERE id=$1', [req.params.id]);
            if (!target.rows.length) return res.json({ success: false, error: 'الموظف غير موجود' });
            if (target.rows[0].role !== 'teller')
                return res.json({ success: false, error: 'لا يمكنك حذف هذا المستخدم' });
        }
        await db.query('DELETE FROM bank_users WHERE id=$1', [req.params.id]);
        res.json({ success: true, message: 'تم الحذف 🗑️' });
    } catch (err) { res.json({ success: false, error: err.message }); }
});

module.exports = router;