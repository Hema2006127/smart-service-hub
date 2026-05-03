/**
 * migrate-passwords.js
 * تشغيل مرة واحدة فقط لتشفير كلمات السر القديمة (plain-text) بـ bcrypt
 * Run: node migrate-passwords.js
 */
require('dotenv').config();
const db = require('./db');
const bcrypt = require('bcrypt');

async function migrate() {
    console.log('🔄 بدء تشفير كلمات السر...');
    try {
        const result = await db.query('SELECT id, username, password FROM bank_users');
        const users = result.rows;
        let upgraded = 0;

        for (const user of users) {
            const isHashed = user.password.startsWith('$2b$') || user.password.startsWith('$2a$');
            if (!isHashed) {
                const hashed = await bcrypt.hash(user.password, 10);
                await db.query('UPDATE bank_users SET password=$1 WHERE id=$2', [hashed, user.id]);
                console.log(`  ✅ ${user.username} — تم التشفير`);
                upgraded++;
            } else {
                console.log(`  ⏭️  ${user.username} — مشفر بالفعل`);
            }
        }

        console.log(`\n✅ انتهى! ${upgraded} مستخدم تم تشفير كلمة سره.`);
        process.exit(0);
    } catch (err) {
        console.error('❌ خطأ:', err.message);
        process.exit(1);
    }
}

migrate();
