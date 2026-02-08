import { query, querySingle } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Helper to handle CORS
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(request, { params }) {
  const start = Date.now();
  console.log(`⏱️ GET Request started: ${params.path?.join('/') || ''} at ${new Date().toISOString()}`);
  try {
    const path = params.path ? params.path.join('/') : '';
    const { searchParams } = new URL(request.url);

    // Get dashboard stats
    if (path === 'stats') {
      const tables = [
        { name: 'saints', lang: true },
        { name: 'books', lang: true },
        { name: 'audio', lang: true },
        { name: 'videos', lang: false },
        { name: 'events', lang: true },
        { name: 'gallery', lang: false },
        { name: 'news', lang: true },
        { name: 'slider', lang: false },
        { name: 'poetry', lang: true }
      ];

      const stats = {};

      for (const table of tables) {
        let sql = `SELECT COUNT(*) FROM ${table.name}`;
        const params = [];

        if (table.lang) {
          sql += ` WHERE language = $1`;
          params.push('en');
        }

        const res = await querySingle(sql, params);
        stats[table.name] = parseInt(res.count);
      }

      return NextResponse.json({ stats }, { headers: corsHeaders() });
    }

    // Get slider images
    if (path === 'slider') {
      const result = await query('SELECT * FROM slider ORDER BY "order" ASC');
      return NextResponse.json({ slides: result.rows }, { headers: corsHeaders() });
    }

    // Get content by page name and language
    if (path === 'content') {
      const pageName = searchParams.get('page');
      const language = searchParams.get('language') || 'en';

      if (!pageName) {
        return NextResponse.json({ error: 'Page name required' }, { status: 400, headers: corsHeaders() });
      }

      const result = await querySingle(
        'SELECT * FROM content WHERE "pageName" = $1 AND language = $2',
        [pageName, language]
      );

      let content = null;
      if (result) {
        content = { ...result, ...result.data };
        delete content.data;
      }

      return NextResponse.json({ content }, { headers: corsHeaders() });
    }

    // Get all saints
    if (path === 'saints') {
      const language = searchParams.get('language') || 'en';
      const result = await query(
        'SELECT * FROM saints WHERE language = $1 ORDER BY "order" ASC',
        [language]
      );
      return NextResponse.json({ saints: result.rows }, { headers: corsHeaders() });
    }

    // Get saint by ID
    if (path.startsWith('saints/')) {
      const saintId = path.split('/')[1];
      const language = searchParams.get('language') || 'en';

      const saint = await querySingle(
        'SELECT * FROM saints WHERE id = $1 AND language = $2',
        [saintId, language]
      );

      return NextResponse.json({ saint }, { headers: corsHeaders() });
    }

    // Get books
    if (path === 'books') {
      const language = searchParams.get('language') || 'en';
      const result = await query(
        'SELECT * FROM books WHERE language = $1 ORDER BY "createdAt" DESC',
        [language]
      );
      return NextResponse.json({ books: result.rows }, { headers: corsHeaders() });
    }

    // Get audio files
    if (path === 'audio') {
      const category = searchParams.get('category'); // hamd, naat, dua
      const language = searchParams.get('language') || 'en';

      let sql = 'SELECT * FROM audio WHERE language = $1';
      const params = [language];

      if (category) {
        sql += ' AND category = $2';
        params.push(category);
      }

      sql += ' ORDER BY "createdAt" DESC';

      const result = await query(sql, params);
      return NextResponse.json({ audioFiles: result.rows }, { headers: corsHeaders() });
    }

    // Get videos
    if (path === 'videos') {
      const result = await query('SELECT * FROM videos ORDER BY "createdAt" DESC');
      return NextResponse.json({ videos: result.rows }, { headers: corsHeaders() });
    }

    // Get events
    if (path === 'events') {
      const language = searchParams.get('language') || 'en';
      const result = await query(
        'SELECT * FROM events WHERE language = $1 ORDER BY "date" ASC',
        [language]
      );
      return NextResponse.json({ events: result.rows }, { headers: corsHeaders() });
    }

    // Get news/press releases
    if (path === 'news') {
      const language = searchParams.get('language') || 'en';
      const result = await query(
        'SELECT * FROM news WHERE language = $1 ORDER BY "date" DESC',
        [language]
      );
      return NextResponse.json({ news: result.rows }, { headers: corsHeaders() });
    }

    // Get gallery images
    if (path === 'gallery') {
      const result = await query('SELECT * FROM gallery ORDER BY "createdAt" DESC');
      return NextResponse.json({ gallery: result.rows }, { headers: corsHeaders() });
    }

    // Get poetry
    if (path === 'poetry') {
      const language = searchParams.get('language') || 'en';
      const result = await query(
        'SELECT * FROM poetry WHERE language = $1 ORDER BY "createdAt" DESC',
        [language]
      );
      return NextResponse.json({ poetry: result.rows }, { headers: corsHeaders() });
    }

    return NextResponse.json({ error: 'Route not found' }, { status: 404, headers: corsHeaders() });
  } catch (error) {
    console.error('GET Error details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(request, { params }) {
  try {
    const path = params.path ? params.path.join('/') : '';
    const body = await request.json();

    // Admin login
    if (path === 'auth/login') {
      const { username, password } = body;
      const adminUser = process.env.ADMIN_USERNAME;
      const adminPass = process.env.ADMIN_PASSWORD;

      if (!adminUser || !adminPass) {
        console.error('❌ Admin credentials not set in .env');
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500, headers: corsHeaders() });
      }

      if (username === adminUser && password === adminPass) {
        const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
        return NextResponse.json({ token, user: { username } }, { headers: corsHeaders() });
      }
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401, headers: corsHeaders() });
    }

    const id = body.id || uuidv4();
    const language = body.language || 'en';

    // Generic handler for most collections
    const collections = ['slider', 'saints', 'books', 'audio', 'videos', 'events', 'news', 'gallery', 'poetry'];

    if (collections.includes(path)) {
      const insertData = { ...body, id };
      const columns = Object.keys(insertData).map(key => `"${key}"`).join(', ');
      const values = Object.values(insertData);
      const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

      const sql = `INSERT INTO ${path} (${columns}) VALUES (${placeholders}) RETURNING *`;
      const result = await querySingle(sql, values);

      return NextResponse.json({ [path === 'audio' ? 'audio' : path.slice(0, -1)]: result }, { headers: corsHeaders() });
    }

    // Add/Update content
    if (path === 'content') {
      const { pageName, language, ...contentData } = body;

      const sql = `
        INSERT INTO content (id, "pageName", language, data)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT ("pageName", language)
        DO UPDATE SET data = $4
        RETURNING *
      `;

      const result = await querySingle(sql, [id, pageName, language, contentData]);

      return NextResponse.json({ content: { ...result, ...result.data } }, { headers: corsHeaders() });
    }

    return NextResponse.json({ error: 'Route not found' }, { status: 404, headers: corsHeaders() });
  } catch (error) {
    console.error('POST Error details:', {
      message: error.message,
      code: error.code,
      details: error.details,
    });
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function PUT(request, { params }) {
  try {
    const path = params.path ? params.path.join('/') : '';
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400, headers: corsHeaders() });
    }

    const collections = ['slider', 'saints', 'books', 'audio', 'videos', 'events', 'news', 'gallery', 'poetry'];

    if (collections.includes(path)) {
      const keys = Object.keys(updateData);
      const setClause = keys.map((key, i) => `"${key}" = $${i + 1}`).join(', ');
      const values = Object.values(updateData);

      let sql = `UPDATE ${path} SET ${setClause} WHERE id = $${values.length + 1}`;
      const params = [...values, id];

      if (updateData.language) {
        sql += ` AND language = $${values.length + 2}`;
        params.push(updateData.language);
      }

      sql += ` RETURNING *`;

      const result = await query(sql, params);

      return NextResponse.json({
        success: true,
        updated: result.rowCount
      }, { headers: corsHeaders() });
    }

    if (path === 'content') {
      const { pageName, language, ...contentData } = updateData;

      const sql = `
        UPDATE content 
        SET data = $1 
        WHERE "pageName" = $2 AND language = $3 
        RETURNING *
      `;

      const result = await query(sql, [contentData, pageName, language]);

      return NextResponse.json({ success: true, updated: result.rowCount }, { headers: corsHeaders() });
    }

    return NextResponse.json({ error: 'Route not found' }, { status: 404, headers: corsHeaders() });
  } catch (error) {
    console.error('PUT Error details:', {
      message: error.message,
      code: error.code,
      details: error.details,
    });
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function DELETE(request, { params }) {
  try {
    const path = params.path ? params.path.join('/') : '';
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400, headers: corsHeaders() });
    }

    const collections = ['slider', 'saints', 'books', 'audio', 'videos', 'events', 'news', 'gallery', 'poetry'];

    if (collections.includes(path)) {
      const result = await query(`DELETE FROM ${path} WHERE id = $1`, [id]);
      return NextResponse.json({ success: true }, { headers: corsHeaders() });
    }

    return NextResponse.json({ error: 'Route not found' }, { status: 404, headers: corsHeaders() });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders() });
  }
}