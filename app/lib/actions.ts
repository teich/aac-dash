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

export async function getCompaniesData(industry?: string) {
  try {
    const result = await pool.query(`
      WITH revenue_order AS (
        SELECT
          CASE
            WHEN revenue = 'over-10b' THEN 7
            WHEN revenue = '1b-10b' THEN 6
            WHEN revenue = '200m-1b' THEN 5
            WHEN revenue = '50m-200m' THEN 4
            WHEN revenue = '10m-50m' THEN 3
            WHEN revenue = '1m-10m' THEN 2
            WHEN revenue = 'under-1m' THEN 1
            ELSE 0
          END AS revenue_rank,
          revenue
        FROM (
          SELECT DISTINCT enrichment_data->'finances'->>'revenue' as revenue
          FROM companies
          WHERE enrichment_data->'finances'->>'revenue' IS NOT NULL
        ) r
      )
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
        COUNT(DISTINCT o.id) as total_orders,
        ro.revenue_rank
      FROM companies c
      JOIN revenue_order ro ON ro.revenue = c.enrichment_data->'finances'->>'revenue'
      LEFT JOIN people p ON p.company_id = c.id
      LEFT JOIN orders o ON o.person_id = p.id
      WHERE ($1::text IS NULL OR 
        c.enrichment_data->'about'->>'industry' = $1 OR 
        $1 = ANY(SELECT jsonb_array_elements_text(c.enrichment_data->'about'->'industries')))
      GROUP BY
        c.id,
        c.name,
        c.domain,
        c.linkedin_url,
        c.enrichment_data,
        ro.revenue_rank,
        ro.revenue
      ORDER BY
        ro.revenue_rank DESC,
        c.name ASC
      LIMIT 50
    `, [industry || null]);
    return result.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw error;
  }
}
