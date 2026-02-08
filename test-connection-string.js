require('dotenv').config();
const { Client } = require('pg');

const testConnection = async () => {
    // Get connection string from environment
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        console.error('❌ Error: DATABASE_URL environment variable is missing.');
        console.log('Please add it to your .env file:');
        console.log('DATABASE_URL=postgresql://user:password@host:port/database');
        return;
    }

    console.log('🔌 Testing direct connection to PostgreSQL...');
    console.log(`Target: ${connectionString.split('@')[1] || 'URL hidden'}`); // Log host for debugging safely

    const client = new Client({
        connectionString,
        ssl: {
            rejectUnauthorized: false // Required for Supabase in many environments
        },
        connectionTimeoutMillis: 10000, // 10s timeout
    });

    try {
        await client.connect();
        console.log('✅ Connected successfully!');

        const res = await client.query('SELECT NOW(), version()');
        console.log('🕰️  Database Time:', res.rows[0].now);
        console.log('📦 Database Version:', res.rows[0].version);

        await client.end();
        console.log('👋 Connection closed.');
    } catch (err) {
        console.error('❌ Connection failed:', err.message);
        if (err.code) console.error('Error Code:', err.code);
    }
};

testConnection();
