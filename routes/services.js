const express = require('express');
const router  = express.Router();
const db      = require('../db');

// الخدمات من الداتابيز
router.get('/', async (req, res) => {
    try {
        // لو عندك جدول services في الداتابيز
        const result = await db.query('SELECT * FROM services ORDER BY id');
        if (result.rows.length) return res.json(result.rows);
        // fallback لو الجدول فاضي أو مش موجود
        throw new Error('empty');
    } catch {
        // بيانات ثابتة fallback
        res.json([
            { id: 1, name: 'فتح حساب جديد', avg_duration: 15 },
            { id: 2, name: 'سحب / إيداع',   avg_duration: 5  },
            { id: 3, name: 'تحويل بنكي',    avg_duration: 10 },
            { id: 4, name: 'طلب بطاقة',     avg_duration: 10 },
            { id: 5, name: 'استفسار عام',   avg_duration: 7  },
        ]);
    }
});

module.exports = router;