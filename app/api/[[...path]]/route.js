import supabase from '@/lib/supabase';
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
      const { count: saintsCount } = await supabase
        .from('saints')
        .select('*', { count: 'exact', head: true })
        .eq('language', 'en');

      const { count: booksCount } = await supabase
        .from('books')
        .select('*', { count: 'exact', head: true })
        .eq('language', 'en');

      const { count: audioCount } = await supabase
        .from('audio')
        .select('*', { count: 'exact', head: true })
        .eq('language', 'en');

      const { count: videosCount } = await supabase
        .from('videos')
        .select('*', { count: 'exact', head: true });

      const { count: eventsCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('language', 'en');

      const { count: galleryCount } = await supabase
        .from('gallery')
        .select('*', { count: 'exact', head: true });

      const { count: newsCount } = await supabase
        .from('news')
        .select('*', { count: 'exact', head: true })
        .eq('language', 'en');

      const { count: sliderCount } = await supabase
        .from('slider')
        .select('*', { count: 'exact', head: true });

      const { count: poetryCount } = await supabase
        .from('poetry')
        .select('*', { count: 'exact', head: true })
        .eq('language', 'en');

      const stats = {
        saints: saintsCount || 0,
        books: booksCount || 0,
        audio: audioCount || 0,
        videos: videosCount || 0,
        events: eventsCount || 0,
        gallery: galleryCount || 0,
        news: newsCount || 0,
        slider: sliderCount || 0,
        poetry: poetryCount || 0,
      };
      return NextResponse.json({ stats }, { headers: corsHeaders() });
    }

    // Get slider images
    if (path === 'slider') {
      const { data, error } = await supabase
        .from('slider')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      return NextResponse.json({ slides: data || [] }, { headers: corsHeaders() });
    }

    // Get content by page name and language
    if (path === 'content') {
      const pageName = searchParams.get('page');
      const language = searchParams.get('language') || 'en';

      if (!pageName) {
        return NextResponse.json({ error: 'Page name required' }, { status: 400, headers: corsHeaders() });
      }

      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('pageName', pageName)
        .eq('language', language)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned

      let content = null;
      if (data) {
        content = { ...data, ...data.data };
        delete content.data;
      }

      return NextResponse.json({ content }, { headers: corsHeaders() });
    }

    // Get all saints
    if (path === 'saints') {
      const language = searchParams.get('language') || 'en';
      const { data, error } = await supabase
        .from('saints')
        .select('*')
        .eq('language', language)
        .order('order', { ascending: true });

      if (error) throw error;
      return NextResponse.json({ saints: data || [] }, { headers: corsHeaders() });
    }

    // Get saint by ID
    if (path.startsWith('saints/')) {
      const saintId = path.split('/')[1];
      const language = searchParams.get('language') || 'en';
      const { data, error } = await supabase
        .from('saints')
        .select('*')
        .eq('id', saintId)
        .eq('language', language)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return NextResponse.json({ saint: data }, { headers: corsHeaders() });
    }

    // Get books
    if (path === 'books') {
      const language = searchParams.get('language') || 'en';
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('language', language)
        .order('createdAt', { ascending: false });

      if (error) throw error;
      return NextResponse.json({ books: data || [] }, { headers: corsHeaders() });
    }

    // Get audio files
    if (path === 'audio') {
      const category = searchParams.get('category'); // hamd, naat, dua
      const language = searchParams.get('language') || 'en';

      let query = supabase
        .from('audio')
        .select('*')
        .eq('language', language);

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query.order('createdAt', { ascending: false });

      if (error) throw error;
      return NextResponse.json({ audioFiles: data || [] }, { headers: corsHeaders() });
    }

    // Get videos
    if (path === 'videos') {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) throw error;
      return NextResponse.json({ videos: data || [] }, { headers: corsHeaders() });
    }

    // Get events
    if (path === 'events') {
      const language = searchParams.get('language') || 'en';
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('language', language)
        .order('date', { ascending: true });

      if (error) throw error;
      return NextResponse.json({ events: data || [] }, { headers: corsHeaders() });
    }

    // Get news/press releases
    if (path === 'news') {
      const language = searchParams.get('language') || 'en';
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('language', language)
        .order('date', { ascending: false });

      if (error) throw error;
      return NextResponse.json({ news: data || [] }, { headers: corsHeaders() });
    }

    // Get gallery images
    if (path === 'gallery') {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) throw error;
      return NextResponse.json({ gallery: data || [] }, { headers: corsHeaders() });
    }

    // Get poetry
    if (path === 'poetry') {
      const language = searchParams.get('language') || 'en';
      const { data, error } = await supabase
        .from('poetry')
        .select('*')
        .eq('language', language)
        .order('createdAt', { ascending: false });

      if (error) throw error;
      return NextResponse.json({ poetry: data || [] }, { headers: corsHeaders() });
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
      if (username === 'admin' && password === 'admin123') {
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

      const { data, error } = await supabase
        .from(path)
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ [path === 'audio' ? 'audio' : path.slice(0, -1)]: data }, { headers: corsHeaders() });
    }

    // Add/Update content
    if (path === 'content') {
      const { pageName, language, ...contentData } = body;

      const { data, error } = await supabase
        .from('content')
        .upsert([{
          id,
          pageName,
          language,
          data: contentData
        }], {
          onConflict: 'pageName,language'
        })
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ content: { ...data, ...data.data } }, { headers: corsHeaders() });
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
      let query = supabase
        .from(path)
        .update(updateData)
        .eq('id', id);

      if (updateData.language) {
        query = query.eq('language', updateData.language);
      }

      const { data, error } = await query.select();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        updated: data?.length || 0
      }, { headers: corsHeaders() });
    }

    if (path === 'content') {
      const { pageName, language, ...contentData } = updateData;

      const { data, error } = await supabase
        .from('content')
        .update({ data: contentData })
        .eq('pageName', pageName)
        .eq('language', language)
        .select();

      if (error) throw error;

      return NextResponse.json({ success: true, updated: data?.length || 0 }, { headers: corsHeaders() });
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
      const { error } = await supabase
        .from(path)
        .delete()
        .eq('id', id);

      if (error) throw error;

      return NextResponse.json({ success: true }, { headers: corsHeaders() });
    }

    return NextResponse.json({ error: 'Route not found' }, { status: 404, headers: corsHeaders() });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders() });
  }
}