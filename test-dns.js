const dns = require('dns');

const hostname = 'db.yawkgfeihmspuubqulil.supabase.co';

console.log(`Looking up ${hostname}...`);

dns.lookup(hostname, { all: true }, (err, addresses) => {
    if (err) {
        console.error('❌ Lookup failed:', err);
        return;
    }
    console.log('Found addresses:', addresses);
});

dns.resolve4(hostname, (err, addresses) => {
    if (err) {
        console.error('❌ IPv4 resolve failed:', err.message);
    } else {
        console.log('IPv4 addresses:', addresses);
    }
});

dns.resolve6(hostname, (err, addresses) => {
    if (err) {
        console.error('❌ IPv6 resolve failed:', err.message);
    } else {
        console.log('IPv6 addresses:', addresses);
    }
});
