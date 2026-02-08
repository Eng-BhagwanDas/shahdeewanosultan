import mysql from 'mysql2/promise';

const poolConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'shahdeewanosultan',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
};

let pool;

if (process.env.NODE_ENV === 'production') {
    pool = mysql.createPool(poolConfig);
} else {
    if (!global._mysqlPool) {
        global._mysqlPool = mysql.createPool(poolConfig);
        console.log('📡 MySQL Pool Created (Global Singleton)');
    }
    pool = global._mysqlPool;
}

export default pool;
