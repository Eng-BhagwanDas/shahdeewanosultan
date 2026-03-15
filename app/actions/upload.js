'use server';

import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';

export async function uploadFile(formData) {
  try {
    const file = formData.get('file');
    const type = formData.get('type') || 'general'; // books, audio, gallery, slider

    if (!file) {
      return { error: 'No file provided' };
    }

    // Validate file type based on upload type
    const allowedTypes = {
      books: ['application/pdf'],
      audio: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/x-m4a', 'audio/m4a'],
      gallery: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      slider: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      introimg: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      general: ['application/pdf', 'audio/mpeg', 'audio/mp3', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    };

    const allowed = allowedTypes[type] || allowedTypes.general;
    if (file.type && !allowed.includes(file.type)) {
      // Small exception for audio types which can be tricky in browser
      if (type === 'audio' && (file.name.endsWith('.mp3') || file.name.endsWith('.wav') || file.name.endsWith('.m4a'))) {
        // Allow based on extension if type check fails
      } else {
        return { error: `Invalid file type. Allowed: ${allowed.join(', ')}` };
      }
    }

    // Create unique filename
    const ext = path.extname(file.name) || (file.type === 'audio/mpeg' ? '.mp3' : '.bin');
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
        contentType: file.type || 'application/octet-stream',
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

    return {
      success: true,
      url: publicUrl,
      filename: filename,
      originalName: file.name,
      size: file.size,
      type: file.type
    };
  } catch (error) {
    console.error('Action upload error:', error);
    return { error: error.message };
  }
}
