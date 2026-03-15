import 'dotenv/config';
import { querySingle, query } from './lib/db.js';

async function checkSchema() {
  try {
    console.log('Checking schema for "videos" table...');
    const res = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'videos'
    `);
    
    console.log('Columns in "videos" table:');
    res.rows.forEach(row => {
      console.log(`- ${row.column_name} (${row.data_type})`);
    });

    const hasCreatedAt = res.rows.some(r => r.column_name === 'createdAt');
    console.log(`Has createdAt: ${hasCreatedAt}`);

    const sample = await query('SELECT * FROM videos LIMIT 5');
    console.log('Sample data (count):', sample.rows.length);
    console.log('Sample data:', JSON.stringify(sample.rows, null, 2));

  } catch (err) {
    console.error('Error checking schema:', err);
  }
}

checkSchema();
