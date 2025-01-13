import { Pool } from 'pg';

if (!process.env.POSTGRES_HOST) {
  throw new Error('POSTGRES_HOST environment variable is required');
}

export const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || "5432"),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
}); 