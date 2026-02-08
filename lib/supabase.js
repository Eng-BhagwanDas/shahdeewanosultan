import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

export const query = (text, params) => pool.query(text, params);

// Helper for single result
export const querySingle = async (text, params) => {
    const res = await pool.query(text, params);
    return res.rows[0];
};

export default {
    from: () => {
        throw new Error("Supabase client has been replaced with raw SQL. Please use the exported 'query' function.");
    }
};
