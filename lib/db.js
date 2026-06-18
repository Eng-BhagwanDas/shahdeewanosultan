import { Pool } from 'pg';

let pool;

if (process.env.NODE_ENV === 'production') {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
} else {
    if (!global.pgPool) {
        global.pgPool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        });
    }
    pool = global.pgPool;
}

export const query = (text, params) => pool.query(text, params);

// Helper for single result
export const querySingle = async (text, params) => {
    const res = await pool.query(text, params);
    return res.rows[0];
};

export default {
    query,
    querySingle
};
