import { NextResponse } from 'next/server';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';

// Helper to handle CORS
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const type = formData.get('type') || 'general'; // books, audio, gallery, slider

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Validate file type based on upload type
    const allowedTypes = {
      books: ['application/pdf'],
      audio: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'],
      gallery: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      slider: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      general: ['application/pdf', 'audio/mpeg', 'audio/mp3', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    };

    const allowed = allowedTypes[type] || allowedTypes.general;
    if (!allowed.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed: ${allowed.join(', ')}` },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Create unique filename
    const ext = path.extname(file.name);
    const filename = `${uuidv4()}${ext}`;

    // File path within the Supabase 'uploads' bucket
    const filePath = `${type}/${filename}`;

    // Get file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('uploads')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      throw new Error(`Failed to upload to storage: ${uploadError.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('uploads')
      .getPublicUrl(filePath);

    return NextResponse.json(
      {
        success: true,
        url: publicUrl,
        filename: filename,
        originalName: file.name,
        size: file.size,
        type: file.type
      },
      { headers: corsHeaders() }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: corsHeaders() }
    );
  }
}
