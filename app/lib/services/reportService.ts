import { pool } from '@/lib/db';
import { CONSUMER_DOMAINS } from '../constants';

export interface SpendingIncrease {
  companyId: number;
  companyName: string;
  companyDomain: string;
  recentSpending: number;
  previousSpending: number;
  increasePercentage: number;
}

export interface SpendingDropper {
  companyId: number;
  companyName: string;
  companyDomain: string;
  recentSpending: number;
  previousSpending: number;
  dropPercentage: number;
}

export async function getTopDroppers(limit: number = 10, periodMonths: number = 18): Promise<SpendingDropper[]> {
  const query = `
    WITH periods AS (
      SELECT
        c.id as company_id,
        c.name as company_name,
        c.domain as company_domain,
        SUM(CASE 
          WHEN o.date >= NOW() - (INTERVAL '1 month' * $2) THEN o.amount 
          ELSE 0 
        END) as recent_spending,
        SUM(CASE 
          WHEN o.date >= NOW() - (INTERVAL '1 month' * $3)
          AND o.date < NOW() - (INTERVAL '1 month' * $2) THEN o.amount 
          ELSE 0 
        END) as previous_spending
      FROM orders o
      JOIN people p ON o.person_id = p.id
      JOIN companies c ON p.company_id = c.id
      WHERE o.date >= NOW() - (INTERVAL '1 month' * $3)
      AND NOT EXISTS (
        SELECT 1 FROM unnest($4::text[]) as cd
        WHERE LOWER(c.domain) = LOWER(cd) 
        OR LOWER(c.domain) LIKE '%.' || LOWER(cd)
      )
      GROUP BY c.id, c.name, c.domain
      HAVING 
        SUM(CASE 
          WHEN o.date >= NOW() - (INTERVAL '1 month' * $3)
          AND o.date < NOW() - (INTERVAL '1 month' * $2) THEN o.amount 
          ELSE 0 
        END) > 0
    )
    SELECT 
      company_id as "companyId",
      company_name as "companyName",
      company_domain as "companyDomain",
      recent_spending as "recentSpending",
      previous_spending as "previousSpending",
      ROUND(((recent_spending - previous_spending) / previous_spending * 100)::numeric, 2) as "dropPercentage"
    FROM periods
    WHERE recent_spending < previous_spending
    ORDER BY ((recent_spending - previous_spending) / previous_spending) ASC
    LIMIT $1;
  `;

  const result = await pool.query<SpendingDropper>(query, [
    limit,
    periodMonths,
    periodMonths * 2,
    CONSUMER_DOMAINS
  ]);
  
  return result.rows;
}

export async function getTopIncreases(limit: number = 10, periodMonths: number = 18): Promise<SpendingIncrease[]> {
  const query = `
    WITH periods AS (
      SELECT
        c.id as company_id,
        c.name as company_name,
        c.domain as company_domain,
        SUM(CASE 
          WHEN o.date >= NOW() - (INTERVAL '1 month' * $2) THEN o.amount 
          ELSE 0 
        END) as recent_spending,
        SUM(CASE 
          WHEN o.date >= NOW() - (INTERVAL '1 month' * $3)
          AND o.date < NOW() - (INTERVAL '1 month' * $2) THEN o.amount 
          ELSE 0 
        END) as previous_spending
      FROM orders o
      JOIN people p ON o.person_id = p.id
      JOIN companies c ON p.company_id = c.id
      WHERE o.date >= NOW() - (INTERVAL '1 month' * $3)
      AND NOT EXISTS (
        SELECT 1 FROM unnest($4::text[]) as cd
        WHERE LOWER(c.domain) = LOWER(cd) 
        OR LOWER(c.domain) LIKE '%.' || LOWER(cd)
      )
      GROUP BY c.id, c.name, c.domain
      HAVING 
        SUM(CASE 
          WHEN o.date >= NOW() - (INTERVAL '1 month' * $3)
          AND o.date < NOW() - (INTERVAL '1 month' * $2) THEN o.amount 
          ELSE 0 
        END) > 0
    )
    SELECT 
      company_id as "companyId",
      company_name as "companyName",
      company_domain as "companyDomain",
      recent_spending as "recentSpending",
      previous_spending as "previousSpending",
      ROUND(((recent_spending - previous_spending) / previous_spending * 100)::numeric, 2) as "increasePercentage"
    FROM periods
    WHERE recent_spending > previous_spending
    ORDER BY ((recent_spending - previous_spending) / previous_spending) DESC
    LIMIT $1;
  `;

  const result = await pool.query<SpendingIncrease>(query, [
    limit,
    periodMonths,
    periodMonths * 2,
    CONSUMER_DOMAINS
  ]);
  
  return result.rows;
}
