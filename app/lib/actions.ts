// app/lib/actions.ts
"use server";

import { Pool } from "pg";

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || "5432"),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

// List of consumer domains to exclude
const CONSUMER_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'aol.com',
  'msn.com',
  'live.com',
  'icloud.com',
  'facebook.com',
  'twitter.com',
  'instagram.com',
  'linkedin.com',
  'google.com',
  'microsoft.com',
  'apple.com',
  'amazon.com',
  'netflix.com',
  'spotify.com',
  'youtube.com',
  'tiktok.com',
  'comcast.net'
];

export async function getCompaniesData(industry?: string, includeConsumerSites: boolean = false) {
  try {
    const result = await pool.query(`
      SELECT
        c.id,
        c.name,
        c.domain,
        c.linkedin_url,
        c.enrichment_data->'finances'->>'revenue' as revenue,
        c.enrichment_data->'about'->>'totalEmployees' as employees,
        c.enrichment_data->'about'->>'industry' as primary_industry,
        c.enrichment_data->'about'->'industries' as all_industries,
        c.enrichment_data->'about'->>'yearFounded' as year_founded,
        c.enrichment_data->'descriptions'->>'primary' as description,
        c.enrichment_data->'analytics'->>'monthlyVisitors' as monthly_visitors,
        c.enrichment_data->'locations'->'headquarters'->'country'->>'name' as country,
        c.enrichment_data->'locations'->'headquarters'->'city'->>'name' as city,
        c.enrichment_data->'locations'->'headquarters'->'state'->>'name' as state,
        COUNT(DISTINCT p.id) as total_people,
        COALESCE(SUM(o.amount), 0) as total_sales,
        COUNT(DISTINCT o.id) as total_orders
      FROM companies c
      LEFT JOIN people p ON p.company_id = c.id
      LEFT JOIN orders o ON o.person_id = p.id
      WHERE ($1::text IS NULL OR 
        c.enrichment_data->'about'->>'industry' = $1 OR 
        $1 = ANY(SELECT jsonb_array_elements_text(c.enrichment_data->'about'->'industries')))
        AND ($3 OR NOT (c.domain = ANY($2)))
      GROUP BY
        c.id,
        c.name,
        c.domain,
        c.linkedin_url,
        c.enrichment_data
      ORDER BY
        total_sales DESC,
        c.name ASC
      LIMIT 50
    `, [industry || null, CONSUMER_DOMAINS, includeConsumerSites]);
    return result.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw error;
  }
}
