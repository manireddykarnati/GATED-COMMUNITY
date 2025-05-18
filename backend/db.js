// db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'gcms',
  password: 'chandan@2710',
  port: 5432,
});

pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL DB"))
  .catch((err) => {
    console.error("❌ DB connection error:", err);
    process.exit(1);
  });

module.exports = pool;
