const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'org',
    password: 'mani123',
    port: 5433,
});

pool.connect()
    .then(() => console.log("✅ Connected to PostgreSQL DB"))
    .catch((err) => {
        console.error("❌ DB connection error:", err);
        process.exit(1);
    });

module.exports = pool;