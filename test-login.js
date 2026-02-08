// using built-in fetch
// using built-in fetch if available, else require

const login = async (username, password) => {
    console.log(`🔐 Attempting login with ${username} / ${password.substring(0, 3)}...`);
    try {
        const res = await fetch('http://127.0.0.1:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (res.ok) {
            const data = await res.json();
            console.log('✅ Login Successful!');
            console.log('Token received:', data.token ? 'Yes' : 'No');
        } else {
            const err = await res.json();
            console.log(`❌ Login Failed: ${res.status} - ${err.error}`);
        }
    } catch (e) {
        console.error('❌ Error:', e.message);
    }
};

const run = async () => {
    // Test 1: Old credentials (should fail)
    await login('admin', 'admin123');

    // Test 2: New credentials (should pass)
    // Note: In real test, we should load from .env, but here we test the expected values
    await login('sdsadmin', 'Sultan@786!Secure');
};

run();
