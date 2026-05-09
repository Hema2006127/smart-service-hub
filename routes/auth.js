const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password)
        return res.json({ success: false, error: 'ادخل بياناتك' });

    const validRoles = ['admin', 'branch_manager', 'teller'];
    if (role && !validRoles.includes(role))
        return res.json({ success: false, error: 'الدور غير صحيح' });

    try {
        let result;
        if (role) {
            result = await db.query(
                "SELECT * FROM bank_users WHERE username = $1 AND password = $2 AND role = $3",
                [username, password, role]
            );
        } else {
            result = await db.query(
                "SELECT * FROM bank_users WHERE username = $1 AND password = $2",
                [username, password]
            );
        }

        if (!result.rows.length)
            return res.json({ success: false, error: role ? 'بيانات غلط أو الدور لا يطابق' : 'بيانات غلط' });

        const user = result.rows[0];
        req.session.user = { id: user.id, username: user.username, name: user.name, role: user.role, branchId: user.branch_id };
        const map = { admin: '/', branch_manager: '/manager', teller: '/teller' };
        res.json({ success: true, redirect: map[user.role] || '/', user: req.session.user });
    } catch (err) {
        console.error(err);
        res.json({ success: false, error: 'خطا في السيرفر' });
    }
});

module.exports = router;