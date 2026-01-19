import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME || 'dargah_portal';

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(MONGO_URL);
  const db = client.db(DB_NAME);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

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
  try {
    const { db } = await connectToDatabase();
    const path = params.path ? params.path.join('/') : '';
    const { searchParams } = new URL(request.url);

    // Get dashboard stats
    if (path === 'stats') {
      const stats = {
        saints: await db.collection('saints').countDocuments({ language: 'en' }),
        books: await db.collection('books').countDocuments({ language: 'en' }),
        audio: await db.collection('audio').countDocuments({ language: 'en' }),
        videos: await db.collection('videos').countDocuments({}),
        events: await db.collection('events').countDocuments({ language: 'en' }),
        gallery: await db.collection('gallery').countDocuments({}),
        news: await db.collection('news').countDocuments({ language: 'en' }),
        slider: await db.collection('slider').countDocuments({}),
        poetry: await db.collection('poetry').countDocuments({ language: 'en' }),
      };
      return NextResponse.json({ stats }, { headers: corsHeaders() });
    }

    // Get slider images
    if (path === 'slider') {
      const slides = await db.collection('slider').find({}).sort({ order: 1 }).toArray();
      return NextResponse.json({ slides }, { headers: corsHeaders() });
    }

    // Get content by page name and language
    if (path === 'content') {
      const pageName = searchParams.get('page');
      const language = searchParams.get('language') || 'en';

      if (!pageName) {
        return NextResponse.json({ error: 'Page name required' }, { status: 400, headers: corsHeaders() });
      }

      const content = await db.collection('content').findOne({ pageName, language });
      return NextResponse.json({ content }, { headers: corsHeaders() });
    }

    // Get all saints
    if (path === 'saints') {
      const language = searchParams.get('language') || 'en';
      const saints = await db.collection('saints').find({ language }).sort({ order: 1 }).toArray();
      return NextResponse.json({ saints }, { headers: corsHeaders() });
    }

    // Get saint by ID
    if (path.startsWith('saints/')) {
      const saintId = path.split('/')[1];
      const language = searchParams.get('language') || 'en';
      const saint = await db.collection('saints').findOne({ id: saintId, language });
      return NextResponse.json({ saint }, { headers: corsHeaders() });
    }

    // Get books
    if (path === 'books') {
      const language = searchParams.get('language') || 'en';
      const books = await db.collection('books').find({ language }).sort({ createdAt: -1 }).toArray();
      return NextResponse.json({ books }, { headers: corsHeaders() });
    }

    // Get audio files
    if (path === 'audio') {
      const category = searchParams.get('category'); // hamd, naat, dua
      const language = searchParams.get('language') || 'en';
      const query = { language };
      if (category) query.category = category;

      const audioFiles = await db.collection('audio').find(query).sort({ createdAt: -1 }).toArray();
      return NextResponse.json({ audioFiles }, { headers: corsHeaders() });
    }

    // Get videos
    if (path === 'videos') {
      const videos = await db.collection('videos').find({}).sort({ createdAt: -1 }).toArray();
      return NextResponse.json({ videos }, { headers: corsHeaders() });
    }

    // Get events
    if (path === 'events') {
      const language = searchParams.get('language') || 'en';
      const events = await db.collection('events').find({ language }).sort({ date: 1 }).toArray();
      return NextResponse.json({ events }, { headers: corsHeaders() });
    }

    // Get news/press releases
    if (path === 'news') {
      const language = searchParams.get('language') || 'en';
      const news = await db.collection('news').find({ language }).sort({ date: -1 }).toArray();
      return NextResponse.json({ news }, { headers: corsHeaders() });
    }

    // Get gallery images
    if (path === 'gallery') {
      const gallery = await db.collection('gallery').find({}).sort({ createdAt: -1 }).toArray();
      return NextResponse.json({ gallery }, { headers: corsHeaders() });
    }

    // Get poetry
    if (path === 'poetry') {
      const language = searchParams.get('language') || 'en';
      const poetry = await db.collection('poetry').find({ language }).sort({ createdAt: -1 }).toArray();
      return NextResponse.json({ poetry }, { headers: corsHeaders() });
    }

    return NextResponse.json({ error: 'Route not found' }, { status: 404, headers: corsHeaders() });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    const path = params.path ? params.path.join('/') : '';
    const body = await request.json();

    // Admin login
    if (path === 'auth/login') {
      const { username, password } = body;

      // Simple auth - in production, use hashed passwords
      const adminUser = process.env.ADMIN_USERNAME || 'admin';
      const adminPass = process.env.ADMIN_PASSWORD || 'admin123';

      if (username === adminUser && password === adminPass) {
        const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
        return NextResponse.json({ token, user: { username } }, { headers: corsHeaders() });
      }

      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401, headers: corsHeaders() });
    }

    // Add slider
    if (path === 'slider') {
      const slide = {
        id: uuidv4(),
        ...body,
        createdAt: new Date(),
      };
      await db.collection('slider').insertOne(slide);
      return NextResponse.json({ slide }, { headers: corsHeaders() });
    }

    // Add/Update content
    if (path === 'content') {
      const { pageName, language, ...contentData } = body;

      const content = {
        id: uuidv4(),
        pageName,
        language,
        ...contentData,
        updatedAt: new Date(),
      };

      await db.collection('content').updateOne(
        { pageName, language },
        { $set: content },
        { upsert: true }
      );

      return NextResponse.json({ content }, { headers: corsHeaders() });
    }

    // Add saint
    if (path === 'saints') {
      const { id, language } = body;

      // Check for duplicate
      if (id && language) {
        const existing = await db.collection('saints').findOne({ id, language });
        if (existing) {
          return NextResponse.json(
            { error: `Saint already exists for language '${language}'. Please use Edit.` },
            { status: 409, headers: corsHeaders() }
          );
        }
      }

      const saint = {
        id: id || uuidv4(),
        ...body,
        createdAt: new Date(),
      };
      await db.collection('saints').insertOne(saint);
      return NextResponse.json({ saint }, { headers: corsHeaders() });
    }

    // Add book
    if (path === 'books') {
      const book = {
        id: uuidv4(),
        ...body,
        createdAt: new Date(),
      };
      await db.collection('books').insertOne(book);
      return NextResponse.json({ book }, { headers: corsHeaders() });
    }

    // Add audio
    if (path === 'audio') {
      const audio = {
        id: uuidv4(),
        ...body,
        createdAt: new Date(),
      };
      await db.collection('audio').insertOne(audio);
      return NextResponse.json({ audio }, { headers: corsHeaders() });
    }

    // Add video
    if (path === 'videos') {
      const video = {
        id: uuidv4(),
        ...body,
        createdAt: new Date(),
      };
      await db.collection('videos').insertOne(video);
      return NextResponse.json({ video }, { headers: corsHeaders() });
    }

    // Add event
    if (path === 'events') {
      const event = {
        id: uuidv4(),
        ...body,
        createdAt: new Date(),
      };
      await db.collection('events').insertOne(event);
      return NextResponse.json({ event }, { headers: corsHeaders() });
    }

    // Add news
    if (path === 'news') {
      const news = {
        id: uuidv4(),
        ...body,
        date: new Date(),
      };
      await db.collection('news').insertOne(news);
      return NextResponse.json({ news }, { headers: corsHeaders() });
    }

    // Add gallery image
    if (path === 'gallery') {
      const image = {
        id: uuidv4(),
        ...body,
        createdAt: new Date(),
      };
      await db.collection('gallery').insertOne(image);
      return NextResponse.json({ image }, { headers: corsHeaders() });
    }

    // Add poetry
    if (path === 'poetry') {
      const poem = {
        id: uuidv4(),
        ...body,
        createdAt: new Date(),
      };
      await db.collection('poetry').insertOne(poem);
      return NextResponse.json({ poem }, { headers: corsHeaders() });
    }

    return NextResponse.json({ error: 'Route not found' }, { status: 404, headers: corsHeaders() });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function PUT(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    const path = params.path ? params.path.join('/') : '';
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400, headers: corsHeaders() });
    }

    const collections = ['slider', 'saints', 'books', 'audio', 'videos', 'events', 'news', 'gallery', 'poetry', 'content'];

    if (collections.includes(path)) {
      const query = { id };
      if (updateData.language) {
        query.language = updateData.language;
      }

      const result = await db.collection(path).updateOne(
        query,
        { $set: { ...updateData, updatedAt: new Date() } },
        { upsert: true }
      );

      return NextResponse.json({
        success: true,
        updated: result.modifiedCount,
        upserted: result.upsertedCount
      }, { headers: corsHeaders() });
    }

    return NextResponse.json({ error: 'Route not found' }, { status: 404, headers: corsHeaders() });
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    const path = params.path ? params.path.join('/') : '';
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400, headers: corsHeaders() });
    }

    const collections = ['slider', 'saints', 'books', 'audio', 'videos', 'events', 'news', 'gallery', 'poetry'];

    if (collections.includes(path)) {
      await db.collection(path).deleteOne({ id });
      return NextResponse.json({ success: true }, { headers: corsHeaders() });
    }

    return NextResponse.json({ error: 'Route not found' }, { status: 404, headers: corsHeaders() });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders() });
  }
}