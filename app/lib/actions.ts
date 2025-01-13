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
  'comcast.net',
  'verizon.net',
  'sbcglobal.net',
  'cox.net',
  'att.net',
  'bellsouth.net',
  'earthlink.net',
  'juno.com',
  'mac.com',
  'optonline.net',
  'roadrunner.com',
  'me.com',
  'GMAIL.COM',
  'charter.net',
];

export async function getCompaniesData(
  industry?: string, 
  includeConsumerSites: boolean = false,
  search?: string,
  page: number = 1,
  pageSize: number = 12,
  sortField: string = 'total_sales',
  sortDirection: 'asc' | 'desc' = 'desc',
  revenueRanges: string[] = []
) {
  // Validate sort field to prevent SQL injection
  const allowedSortFields = [
    'name',
    'domain',
    'total_sales',
    'total_orders',
    'total_people',
    'monthly_visitors',
    'employees',
    'year_founded'
  ];
  
  if (!allowedSortFields.includes(sortField)) {
    sortField = 'total_sales';
  }

  try {
    // First get total count for pagination
    const countResult = await pool.query(`
      SELECT COUNT(DISTINCT c.id)
      FROM companies c
      WHERE ($1::text IS NULL OR 
        c.enrichment_data->'about'->>'industry' = $1 OR 
        $1 = ANY(SELECT jsonb_array_elements_text(c.enrichment_data->'about'->'industries')))
        AND ($3 OR NOT (c.domain = ANY($2)))
        AND ($4::text IS NULL OR 
          LOWER(c.name) LIKE LOWER($4) OR 
          LOWER(c.domain) LIKE LOWER($4))
        AND ($5::text[] IS NULL OR array_length($5, 1) IS NULL OR
          c.enrichment_data->'finances'->>'revenue' = ANY($5))
    `, [industry || null, CONSUMER_DOMAINS, includeConsumerSites, search ? `%${search}%` : null, revenueRanges.length > 0 ? revenueRanges : null]);

    const totalCount = parseInt(countResult.rows[0].count);

    // Then get paginated data
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
        c.enrichment_data->'assets'->'logoSquare'->>'src' as logo_square,
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
        AND ($4::text IS NULL OR 
          LOWER(c.name) LIKE LOWER($4) OR 
          LOWER(c.domain) LIKE LOWER($4))
        AND ($5::text[] IS NULL OR array_length($5, 1) IS NULL OR
          c.enrichment_data->'finances'->>'revenue' = ANY($5))
      GROUP BY
        c.id,
        c.name,
        c.domain,
        c.linkedin_url,
        c.enrichment_data
      ORDER BY
        CASE
          WHEN $8 = 'name' AND $7 = 'desc' THEN c.name END DESC NULLS LAST,
        CASE
          WHEN $8 = 'name' AND $7 = 'asc' THEN c.name END ASC NULLS LAST,
        CASE
          WHEN $8 = 'domain' AND $7 = 'desc' THEN c.domain END DESC NULLS LAST,
        CASE
          WHEN $8 = 'domain' AND $7 = 'asc' THEN c.domain END ASC NULLS LAST,
        CASE
          WHEN $8 = 'total_sales' AND $7 = 'desc' THEN SUM(o.amount) END DESC NULLS LAST,
        CASE
          WHEN $8 = 'total_sales' AND $7 = 'asc' THEN SUM(o.amount) END ASC NULLS LAST,
        CASE
          WHEN $8 = 'total_orders' AND $7 = 'desc' THEN COUNT(DISTINCT o.id) END DESC NULLS LAST,
        CASE
          WHEN $8 = 'total_orders' AND $7 = 'asc' THEN COUNT(DISTINCT o.id) END ASC NULLS LAST,
        CASE
          WHEN $8 = 'total_people' AND $7 = 'desc' THEN COUNT(DISTINCT p.id) END DESC NULLS LAST,
        CASE
          WHEN $8 = 'total_people' AND $7 = 'asc' THEN COUNT(DISTINCT p.id) END ASC NULLS LAST,
        c.name ASC
      LIMIT $6
      OFFSET $9
    `, [
      industry || null, 
      CONSUMER_DOMAINS, 
      includeConsumerSites,
      search ? `%${search}%` : null,
      revenueRanges.length > 0 ? revenueRanges : null,
      pageSize,
      sortDirection,
      sortField,
      (page - 1) * pageSize
    ]);

    return {
      companies: result.rows,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize)
    };
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
}
