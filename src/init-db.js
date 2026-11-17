import fs from 'node:fs';
import { pool } from './db.js';
try { const sql = fs.readFileSync(new URL('../db/schema.sql', import.meta.url), 'utf8'); await pool.query(sql); console.log('Quick Drop database schema created successfully.'); }
catch (error) { console.error('Database initialization failed:', error.message); process.exitCode = 1; }
finally { await pool.end(); }
