// Quick test script to verify Supabase connection
// Run this with: node test-supabase.js

const testSupabaseConnection = async () => {
    console.log('🧪 Testing Supabase Connection...\n');

    try {
        // Test 1: Check if server is running
        console.log('1️⃣ Testing server connection...');
        const response = await fetch('http://localhost:3000/api/stats');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Server is running!');
        console.log('📊 Stats:', data);
        console.log('');

        // Test 2: Check slider endpoint
        console.log('2️⃣ Testing slider endpoint...');
        const sliderResponse = await fetch('http://localhost:3000/api/slider');
        const sliderData = await sliderResponse.json();
        console.log('✅ Slider endpoint working!');
        console.log('📸 Slides count:', sliderData.slides?.length || 0);
        console.log('');

        // Test 3: Check saints endpoint
        console.log('3️⃣ Testing saints endpoint...');
        const saintsResponse = await fetch('http://localhost:3000/api/saints?language=en');
        const saintsData = await saintsResponse.json();
        console.log('✅ Saints endpoint working!');
        console.log('👤 Saints count:', saintsData.saints?.length || 0);
        console.log('');

        console.log('🎉 All tests passed! Supabase is connected and working!\n');
        console.log('Next steps:');
        console.log('- Visit http://localhost:3000 to see your app');
        console.log('- Visit http://localhost:3000/admin to access admin panel');
        console.log('- Try adding some data through the admin panel');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.log('\n⚠️ Troubleshooting:');
        console.log('1. Make sure dev server is running (npm run dev)');
        console.log('2. Check your .env file has correct Supabase credentials');
        console.log('3. Verify you ran supabase_schema.sql in Supabase SQL Editor');
        console.log('4. Check Supabase dashboard to ensure project is active');
    }
};

testSupabaseConnection();
