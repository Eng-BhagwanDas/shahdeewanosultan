// using built-in fetch

const baseUrl = 'http://127.0.0.1:3000/api';

const testEndpoint = async (name, path) => {
    console.log(`🧪 Testing ${name} (${path})...`);
    try {
        const res = await fetch(`${baseUrl}/${path}`);
        if (!res.ok) {
            console.error(`❌ ${name} failed with status: ${res.status}`);
            const text = await res.text();
            console.error('Response:', text);
            return false;
        }
        const data = await res.json();
        const keys = Object.keys(data);
        console.log(`✅ ${name} success! Keys: ${keys.join(', ')}`);

        // Log first item if array
        const firstKey = keys[0];
        if (Array.isArray(data[firstKey])) {
            console.log(`   Count: ${data[firstKey].length}`);
            if (data[firstKey].length > 0) {
                console.log(`   First Item ID: ${data[firstKey][0].id}`);
            }
        } else if (typeof data[firstKey] === 'object') {
            console.log(`   Data: ${JSON.stringify(data[firstKey], null, 2)}`);
        }

        return true;
    } catch (err) {
        console.error(`❌ ${name} error:`, err.message);
        return false;
    }
};

const runTests = async () => {
    console.log('🚀 Starting API Tests...\n');

    await testEndpoint('Stats', 'stats');
    await testEndpoint('Slider', 'slider');
    await testEndpoint('Saints', 'saints?language=en');
    await testEndpoint('Books', 'books?language=en');

    console.log('\n🏁 Tests Completed.');
};

runTests();
