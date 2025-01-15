import { pool } from "@/lib/db";
import { Person } from "../types";

export class PersonService {
  static async getPersonById(id: string): Promise<Person | null> {
    const client = await pool.connect();
    try {
      // Get person details with company info and order summary
      const personResult = await client.query(`
        SELECT 
          p.id,
          p.name,
          p.company_id,
          c.name as company_name,
          c.domain as company_domain,
          COUNT(DISTINCT o.id) as total_orders,
          COALESCE(SUM(o.amount), '0') as total_sales
        FROM people p
        JOIN companies c ON c.id = p.company_id
        LEFT JOIN orders o ON o.person_id = p.id
        WHERE p.id = $1
        GROUP BY p.id, p.name, p.company_id, c.name, c.domain
      `, [id]);

      if (personResult.rows.length === 0) {
        return null;
      }

      const person = personResult.rows[0];

      // Get person's orders with line items
      const ordersResult = await client.query(`
        SELECT 
          o.invoice_number,
          o.date,
          o.amount,
          p.name as person_name,
          json_agg(json_build_object(
            'product_name', pr.name,
            'quantity', li.quantity,
            'unit_price', li.unit_price,
            'amount', li.amount
          ))::jsonb as line_items
        FROM orders o
        JOIN people p ON p.id = o.person_id
        JOIN line_items li ON li.order_id = o.id
        JOIN products pr ON pr.id = li.product_id
        WHERE p.id = $1
        GROUP BY o.id, o.invoice_number, o.date, o.amount, p.name
        ORDER BY o.date DESC
      `, [id]);

      return {
        ...person,
        orders: ordersResult.rows
      };
    } finally {
      client.release();
    }
  }
}
