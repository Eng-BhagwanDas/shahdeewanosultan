import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

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
    
    // Determine upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', type);
    
    // Ensure directory exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Get file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Write file
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    // Return the public URL
    const fileUrl = `/uploads/${type}/${filename}`;

    return NextResponse.json(
      { 
        success: true, 
        url: fileUrl,
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
