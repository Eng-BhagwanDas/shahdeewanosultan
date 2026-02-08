const main = async () => {
    try {
        console.log('Fetching stats...');
        const res = await fetch('http://localhost:3000/api/stats');
        console.log('Status:', res.status);
        const data = await res.json();
        console.log('Data:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error:', err);
    }
}
main();
