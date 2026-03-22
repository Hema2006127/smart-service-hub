const express = require('express');
const router  = express.Router();
const db      = require('../db');

// POST — تقديم تقييم (متاح للعملاء بدون تسجيل)
router.post('/', async (req, res) => {
    const { branchId, rating, comment, service, token, queueId } = req.body;
    if (!branchId || !rating) return res.json({ success: false, error: 'بيانات ناقصة' });
    if (rating < 1 || rating > 5) return res.json({ success: false, error: 'التقييم من 1 إلى 5' });
    try {
        await db.query(
            'INSERT INTO bank_ratings (queue_id, branch_id, rating, comment, service, token) VALUES ($1,$2,$3,$4,$5,$6)',
            [queueId || null, parseInt(branchId), parseInt(rating), comment || '', service || '', token || '']
        );
        res.json({ success: true, message: 'شكراً على تقييمك!' });
    } catch (err) { res.json({ success: false, error: err.message }); }
});

// GET — جلب التقييمات (للمدراء والادمن)
router.get('/', async (req, res) => {
    const user = req.session?.user;
    if (!user) return res.status(401).json({ error: 'غير مسجل' });
    try {
        const isManager = user.role === 'branch_manager';
        const baseFilter = isManager ? `WHERE r.branch_id = ${parseInt(user.branchId)}` : '';
        const summaryFilter = isManager ? `WHERE r.branch_id = ${parseInt(user.branchId)}` : '';

        const ratings = await db.query(`
            SELECT r.*, b.name as branch_name
            FROM bank_ratings r
            LEFT JOIN bank_branches b ON b.id = r.branch_id
            ${baseFilter}
            ORDER BY r.created_at DESC
            LIMIT 100
        `);

        const summary = await db.query(`
            SELECT
                r.branch_id,
                b.name as branch_name,
                COUNT(*) as total,
                ROUND(AVG(rating)::numeric, 1) as avg_rating,
                COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
                COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
                COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
                COUNT(CASE WHEN rating <= 2 THEN 1 END) as low_star
            FROM bank_ratings r
            LEFT JOIN bank_branches b ON b.id = r.branch_id
            ${summaryFilter}
            GROUP BY r.branch_id, b.name
            ORDER BY avg_rating DESC
        `);

        res.json({ ratings: ratings.rows, summary: summary.rows });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
