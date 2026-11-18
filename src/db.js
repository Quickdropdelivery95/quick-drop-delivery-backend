
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

if (process.env.NODE_ENV === 'production' && !process.env.SUPABASE_CA_CERT) {
  throw new Error('SUPABASE_CA_CERT is missing');
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? {
        ca: process.env.SUPABASE_CA_CERT,
        rejectUnauthorized: true
      }
    : false
});

pool.on('error', err => {
  console.error('Unexpected PostgreSQL pool error:', err.message);
});

