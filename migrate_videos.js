import 'dotenv/config';
import { query } from './lib/db.js';

async function migrate() {
  try {
    console.log('Migrating "videos" table...');
    
    // Add missing columns
    await query(`
      ALTER TABLE videos 
      ADD COLUMN IF NOT EXISTS description text,
      ADD COLUMN IF NOT EXISTS "videoId" varchar(255),
      ADD COLUMN IF NOT EXISTS "youtubeUrl" text,
      ADD COLUMN IF NOT EXISTS "language" varchar(10) DEFAULT 'en'
    `);
    
    console.log('Successfully added columns: description, videoId, youtubeUrl');
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

migrate();
