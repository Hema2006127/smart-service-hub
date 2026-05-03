require('dotenv').config();
const db = require('./db');

async function migrate() {
    console.log('🚀 Starting migration v2...');
    try {
        // Add priority column to bank_queue
        await db.query(`ALTER TABLE bank_queue ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal'`);
        console.log('✅ Added priority column to bank_queue');

        // Ratings table
        await db.query(`
            CREATE TABLE IF NOT EXISTS bank_ratings (
                id SERIAL PRIMARY KEY,
                queue_id INTEGER,
                branch_id INTEGER NOT NULL,
                rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
                comment TEXT DEFAULT '',
                service TEXT DEFAULT '',
                token TEXT DEFAULT '',
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);
        console.log('✅ Created bank_ratings table');

        // Audit log table
        await db.query(`
            CREATE TABLE IF NOT EXISTS bank_audit_log (
                id SERIAL PRIMARY KEY,
                user_id INTEGER,
                username TEXT DEFAULT 'system',
                role TEXT DEFAULT '',
                action TEXT NOT NULL,
                details TEXT DEFAULT '',
                ip TEXT DEFAULT '',
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);
        console.log('✅ Created bank_audit_log table');

        // Staff schedule table
        await db.query(`
            CREATE TABLE IF NOT EXISTS bank_schedules (
                id SERIAL PRIMARY KEY,
                staff_id INTEGER NOT NULL,
                branch_id INTEGER,
                date DATE NOT NULL,
                status TEXT DEFAULT 'working',
                note TEXT DEFAULT '',
                created_at TIMESTAMP DEFAULT NOW(),
                UNIQUE(staff_id, date)
            )
        `);
        console.log('✅ Created bank_schedules table');

        console.log('\n🎉 Migration v2 completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration error:', err.message);
        process.exit(1);
    }
}

migrate();
