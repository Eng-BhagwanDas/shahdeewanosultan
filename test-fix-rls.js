require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function fixStoragePolicy() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Ensure bucket exists and is public...');
    const { data: buckets, error: getBucketsError } = await supabase.storage.getBuckets();
    if (getBucketsError) console.error('Error getting buckets', getBucketsError);
    else console.log('Current buckets:', buckets.map(b => b.name));

    if (!buckets?.find(b => b.name === 'uploads')) {
        console.log('Bucket "uploads" not found, creating it...');
        const { data, error } = await supabase.storage.createBucket('uploads', {
            public: true,
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'application/pdf', 'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'],
            fileSizeLimit: 10485760 // 10MB
        });
        if (error) console.error('Error creating bucket:', error);
        else console.log('Bucket created successfully!');
    } else {
        console.log('Bucket "uploads" already exists. Updating to ensure public...');
        await supabase.storage.updateBucket('uploads', { public: true });
    }

    console.log('Run the following SQL in your Supabase SQL Editor to allow uploads:');
    console.log(`
-- Allow public uploads to the uploads bucket
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT TO public
WITH CHECK ( bucket_id = 'uploads' );

CREATE POLICY "Allow public update"
ON storage.objects FOR UPDATE TO public
USING ( bucket_id = 'uploads' );

CREATE POLICY "Allow public select"
ON storage.objects FOR SELECT TO public
USING ( bucket_id = 'uploads' );
  `);
}

fixStoragePolicy();
