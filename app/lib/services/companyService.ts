import { pool } from "@/lib/db";
import { CompanyData, GetCompaniesOptions, CompaniesResponse } from "../types";
import { CONSUMER_DOMAINS } from "@/app/lib/constants";

export class CompanyService {
  static async getCompanyByDomain(domain: string): Promise<CompanyData | null> {
    const client = await pool.connect();
    try {
      const companyResult = await client.query(`
        SELECT 
          name as company_name, 
          domain, 
          linkedin_url,
          enrichment_data::jsonb as enrichment_data,
          enrichment_data->'assets'->'logoSquare'->>'src' as logo_square
        FROM companies
        WHERE domain = $1
      `, [domain]);

      if (companyResult.rows.length === 0) {
        return null;
      }

      const company = companyResult.rows[0];

      const ordersResult = await client.query(`
        SELECT DISTINCT
          o.invoice_number,
          o.date,
          o.amount,
          p.name as person_name,
          p.id as person_id,
          json_agg(json_build_object(
            'product_name', pr.name,
            'quantity', li.quantity,
            'unit_price', li.unit_price,
            'amount', li.amount
          ))::jsonb as line_items
        FROM companies c
        JOIN people p ON p.company_id = c.id
        JOIN orders o ON o.person_id = p.id
        JOIN line_items li ON li.order_id = o.id
        JOIN products pr ON pr.id = li.product_id
        WHERE c.domain = $1
        GROUP BY o.id, o.invoice_number, o.date, o.amount, p.name, p.id
        ORDER BY o.date DESC
      `, [domain]);

      return {
        ...company,
        orders: ordersResult.rows
      };
    } finally {
      client.release();
    }
  }

  static async getCompanies(options: GetCompaniesOptions): Promise<CompaniesResponse> {
    const {
      industry,
      includeConsumerSites = false,
      search,
      page = 1,
      pageSize = 12,
      sortField = "total_sales",
      sortDirection = "desc",
      revenueRanges = [],
      years = [],
    } = options;

    // Validate sort field to prevent SQL injection
    const allowedSortFields = [
      "name", "domain", "total_sales", "total_orders",
      "total_people", "monthly_visitors", "employees", "year_founded"
    ];

    const validatedSortField = allowedSortFields.includes(sortField) ? sortField : "total_sales";

    try {
      // Get total count for pagination
      const countResult = await pool.query(
        `
        SELECT COUNT(DISTINCT c.id)
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
          AND ($6::int[] IS NULL OR array_length($6, 1) IS NULL OR
            EXTRACT(YEAR FROM o.date)::integer = ANY($6))
        `,
        [
          industry || null,
          CONSUMER_DOMAINS,
          includeConsumerSites,
          search ? `%${search}%` : null,
          revenueRanges.length > 0 ? revenueRanges : null,
          years.length > 0 ? years : null,
        ]
      );

      const totalCount = parseInt(countResult.rows[0].count);

      // Get paginated data
      const result = await pool.query(
        `
        SELECT
          c.id::text as id,
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
          COALESCE(COUNT(DISTINCT p.id), 0) as total_people,
          COALESCE(SUM(o.amount), 0) as total_sales,
          COALESCE(COUNT(DISTINCT o.id), 0) as total_orders
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
          AND ($6::int[] IS NULL OR array_length($6, 1) IS NULL OR
            EXTRACT(YEAR FROM o.date)::integer = ANY($6))
        GROUP BY
          c.id,
          c.name,
          c.domain,
          c.linkedin_url,
          c.enrichment_data
        ORDER BY
          CASE
            WHEN $7 = 'name' AND $8 = 'desc' THEN c.name END DESC NULLS LAST,
          CASE
            WHEN $7 = 'name' AND $8 = 'asc' THEN c.name END ASC NULLS LAST,
          CASE
            WHEN $7 = 'domain' AND $8 = 'desc' THEN c.domain END DESC NULLS LAST,
          CASE
            WHEN $7 = 'domain' AND $8 = 'asc' THEN c.domain END ASC NULLS LAST,
          CASE
            WHEN $7 = 'total_sales' AND $8 = 'desc' THEN SUM(o.amount) END DESC NULLS LAST,
          CASE
            WHEN $7 = 'total_sales' AND $8 = 'asc' THEN SUM(o.amount) END ASC NULLS LAST,
          CASE
            WHEN $7 = 'total_orders' AND $8 = 'desc' THEN COUNT(DISTINCT o.id) END DESC NULLS LAST,
          CASE
            WHEN $7 = 'total_orders' AND $8 = 'asc' THEN COUNT(DISTINCT o.id) END ASC NULLS LAST,
          CASE
            WHEN $7 = 'total_people' AND $8 = 'desc' THEN COUNT(DISTINCT p.id) END DESC NULLS LAST,
          CASE
            WHEN $7 = 'total_people' AND $8 = 'asc' THEN COUNT(DISTINCT p.id) END ASC NULLS LAST,
          c.name ASC
        LIMIT $9
        OFFSET $10
        `,
        [
          industry || null,
          CONSUMER_DOMAINS,
          includeConsumerSites,
          search ? `%${search}%` : null,
          revenueRanges.length > 0 ? revenueRanges : null,
          years.length > 0 ? years : null,
          validatedSortField,
          sortDirection,
          pageSize,
          (page - 1) * pageSize
        ]
      );

      return {
        companies: result.rows,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      };
    } catch (error) {
      console.error("Error fetching companies:", error);
      throw error;
    }
  }
}
