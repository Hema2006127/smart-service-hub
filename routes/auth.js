const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.json({ success: false, error: 'ادخل بياناتك' });
    try {
        const sql = "SELECT * FROM bank_users WHERE username = $1 AND password = $2 AND status = 'active'";
        const result = await db.query(sql, [username, password]);
        if (!result.rows.length)
            return res.json({ success: false, error: 'بيانات غلط' });
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