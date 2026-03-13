/*
Run this in the Supabase SQL Editor to allow public uploads to the "uploads" bucket.
By default, all buckets have Row Level Security enabled and deny all access.
These policies will allow insertions and public viewing.
*/

-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT TO public
USING ( bucket_id = 'uploads' );

-- Allow public insert access
CREATE POLICY "Public Insert"
ON storage.objects FOR INSERT TO public
WITH CHECK ( bucket_id = 'uploads' );

-- Allow public update access (if overwriting is needed)
CREATE POLICY "Public Update"
ON storage.objects FOR UPDATE TO public
USING ( bucket_id = 'uploads' );
