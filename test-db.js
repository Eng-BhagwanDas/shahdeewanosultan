const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  try {
    await pool.query(`
      ALTER TABLE audio
      ADD COLUMN IF NOT EXISTS description text;
    `);
    console.log("Migration successful: added 'description' column to 'audio' table.");
  } catch(e) {
    console.error("Migration failed:", e);
  } finally {
    pool.end();
  }
}

runMigration();
