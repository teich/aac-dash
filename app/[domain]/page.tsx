// app/[domain]/page.tsx
import { Building2, Users, Globe2, Calendar, DollarSign, BookOpen, ExternalLink } from 'lucide-react';
import { pool } from '@/lib/db';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { OrdersTable } from './OrdersTable';
import { CompanyBreadcrumb } from '@/app/components/CompanyBreadcrumb';

interface EnrichmentData {
  about?: {
    name?: string;
    industry?: string;
    yearFounded?: number;
    totalEmployees?: string;
    totalEmployeesExact?: number;
    industries?: string[];
  };
  locations?: {
    headquarters?: {
      city?: { name?: string };
      state?: { name?: string };
      country?: { name?: string };
    };
  };
  finances?: {
    revenue?: string;
  };
  analytics?: {
    monthlyVisitors?: string;
  };
  socials?: {
    linkedin?: { url?: string };
    twitter?: { url?: string };
    facebook?: { url?: string };
    instagram?: { url?: string };
  };
  descriptions?: {
    primary?: string;
    tagline?: string;
  };
}

interface LineItem {
  product_name: string;
  quantity: number;
  unit_price: string;
  amount: string;
}

interface Order {
  invoice_number: string;
  date: string;
  amount: string;
  person_name: string;
  line_items: LineItem[];
}

interface CompanyData {
  company_name: string;
  domain: string;
  linkedin_url: string | null;
  enrichment_data: EnrichmentData;
  orders: Order[];
}

// Helper function to format revenue ranges nicely
function formatRevenue(revenue: string): string {
  return revenue.replace(/-/g, ' to ').replace(/([mb])/g, ' $1illion');
}

async function getCompanyData(domain: string): Promise<CompanyData | null> {
  const client = await pool.connect();
  try {
    const companyResult = await client.query(`
      SELECT 
        name as company_name, 
        domain, 
        linkedin_url,
        enrichment_data::jsonb as enrichment_data
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
      GROUP BY o.id, o.invoice_number, o.date, o.amount, p.name
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

type PageProps = {
  params: Promise<{ domain: string }>;
};

export default async function CompanyPage({ params }: PageProps) {
  const resolvedParams = await params;
  const companyData = await getCompanyData(resolvedParams.domain);

  if (!companyData) {
    return <div>Company not found</div>;
  }

  return (
    <div className="space-y-6">
      <CompanyBreadcrumb 
        domain={companyData.domain} 
        companyName={companyData.enrichment_data?.about?.name || companyData.company_name}
      />
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex gap-4 items-center">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10">
                  {companyData.enrichment_data?.about?.name?.slice(0, 2) || companyData.company_name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">
                  {companyData.enrichment_data?.about?.name || companyData.company_name}
                </CardTitle>
                {companyData.enrichment_data?.descriptions?.tagline && (
                  <p className="text-muted-foreground mt-1">{companyData.enrichment_data.descriptions.tagline}</p>
                )}
              </div>
            </div>
            {companyData.enrichment_data?.analytics?.monthlyVisitors && (
              <Badge variant="secondary">
                {companyData.enrichment_data.analytics.monthlyVisitors} monthly visitors
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {companyData.enrichment_data?.descriptions?.primary && (
            <p className="text-muted-foreground">{companyData.enrichment_data.descriptions.primary}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Company Details */}
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <Building2 className="w-5 h-5 text-muted-foreground mt-1" />
                <div>
                  <div className="text-sm text-muted-foreground">Industries</div>
                  <div className="font-medium">
                    {companyData.enrichment_data?.about?.industry && (
                      <div className="flex items-center gap-1">
                        <Badge variant="secondary">{companyData.enrichment_data.about.industry}</Badge>
                        <span className="text-xs text-muted-foreground">(primary)</span>
                      </div>
                    )}
                    {companyData.enrichment_data?.about?.industries && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {companyData.enrichment_data.about.industries
                          .filter(ind => ind !== companyData.enrichment_data?.about?.industry)
                          .map((industry, i) => (
                            <Badge key={i} variant="outline">{industry}</Badge>
                          ))
                        }
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Employees</div>
                  <div className="font-medium">
                    {companyData.enrichment_data?.about?.totalEmployeesExact 
                      ? `${companyData.enrichment_data.about.totalEmployeesExact.toLocaleString()} employees`
                      : companyData.enrichment_data?.about?.totalEmployees || 'N/A'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Founded</div>
                  <div className="font-medium">{companyData.enrichment_data?.about?.yearFounded || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Location & Revenue */}
            <div className="space-y-4">
              {companyData.enrichment_data?.locations?.headquarters && (
                <div className="flex items-center gap-2">
                  <Globe2 className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Headquarters</div>
                    <div className="font-medium">
                      {[
                        companyData.enrichment_data.locations.headquarters.city?.name,
                        companyData.enrichment_data.locations.headquarters.state?.name,
                        companyData.enrichment_data.locations.headquarters.country?.name
                      ].filter(Boolean).join(', ')}
                    </div>
                  </div>
                </div>
              )}

              {companyData.enrichment_data?.finances?.revenue && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Annual Revenue</div>
                    <div className="font-medium">{formatRevenue(companyData.enrichment_data.finances.revenue)}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Technologies & Social */}
            <div className="space-y-4">
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          {companyData.domain && (
            <Button variant="outline" size="sm" asChild>
              <a href={`https://${companyData.domain}`} target="_blank" rel="noopener noreferrer">
                <Globe2 className="w-4 h-4" />
                Website
              </a>
            </Button>
          )}
          {companyData.linkedin_url && (
            <Button variant="outline" size="sm" asChild>
              <a href={companyData.linkedin_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
                LinkedIn
              </a>
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Orders Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
        <OrdersTable data={companyData.orders} />
      </div>
    </div>
  );
}
