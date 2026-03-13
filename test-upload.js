const fs = require('fs');

async function testUpload() {
    // Create a dummy text file to test with
    fs.writeFileSync('dummy.jpg', 'fake image content');

    const formData = new FormData();
    const blob = new Blob([fs.readFileSync('dummy.jpg')], { type: 'image/jpeg' });
    formData.append('file', blob, 'dummy.jpg');
    formData.append('type', 'slider');

    try {
        console.log('Testing upload to http://localhost:3000/api/upload ...');
        const response = await fetch('http://localhost:3000/api/upload', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        console.log('Upload Response:', data);

        if (data.url && data.url.includes('supabase.co')) {
            console.log('✅ Upload successful and hit Supabase Storage!');
        } else {
            console.log('❌ Upload failed or did not return SupabaseURL.', data);
        }
    } catch (err) {
        console.error('Error uploading:', err);
    } finally {
        fs.unlinkSync('dummy.jpg');
    }
}

testUpload();
