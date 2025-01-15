import { Building2, Users, Globe2, Calendar, DollarSign, ExternalLink } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { CompanyAvatar } from "@/components/ui/company-avatar";
import type { CompanyData } from "../lib/types";

// Helper function to format revenue ranges nicely
function formatRevenue(revenue: string): string {
  return revenue.replace(/-/g, ' to ').replace(/([mb])/g, ' $1illion');
}

interface CompanyDetailsProps {
  company: CompanyData;
}

export function CompanyDetails({ company }: CompanyDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex gap-4 items-center">
            <CompanyAvatar 
              name={company.enrichment_data?.about?.name || company.company_name || company.name}
              logoSquare={company.logo_square}
              className="h-12 w-12"
            />
            <div>
              <CardTitle className="text-2xl">
                {company.enrichment_data?.about?.name || company.company_name || company.name}
              </CardTitle>
              {company.enrichment_data?.descriptions?.tagline && (
                <p className="text-muted-foreground mt-1">{company.enrichment_data.descriptions.tagline}</p>
              )}
            </div>
          </div>
          {company.enrichment_data?.analytics?.monthlyVisitors && (
            <Badge variant="secondary">
              {company.enrichment_data.analytics.monthlyVisitors} monthly visitors
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {company.enrichment_data?.descriptions?.primary && (
          <p className="text-muted-foreground">{company.enrichment_data.descriptions.primary}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Company Details */}
          <div className="space-y-6">
            <h3 className="font-semibold">Company Details</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <Building2 className="w-5 h-5 text-muted-foreground mt-1" />
                <div>
                  <div className="text-sm text-muted-foreground">Industries</div>
                  <div className="font-medium">
                    {company.enrichment_data?.about?.industry && (
                      <div className="flex items-center gap-1">
                        <Badge variant="secondary">{company.enrichment_data.about.industry}</Badge>
                        <span className="text-xs text-muted-foreground">(primary)</span>
                      </div>
                    )}
                    {company.enrichment_data?.about?.industries && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {company.enrichment_data.about.industries
                          .filter(ind => ind !== company.enrichment_data?.about?.industry)
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
                    {company.enrichment_data?.about?.totalEmployeesExact 
                      ? `${company.enrichment_data.about.totalEmployeesExact.toLocaleString()} employees`
                      : company.enrichment_data?.about?.totalEmployees || 'N/A'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Founded</div>
                  <div className="font-medium">{company.enrichment_data?.about?.yearFounded || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Location & Revenue */}
          <div className="space-y-6">
            <h3 className="font-semibold">Location & Financials</h3>
            <div className="space-y-4">
              {company.enrichment_data?.locations?.headquarters && (
                <div className="flex items-center gap-2">
                  <Globe2 className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Headquarters</div>
                    <div className="font-medium">
                      {[
                        company.enrichment_data.locations.headquarters.city?.name,
                        company.enrichment_data.locations.headquarters.state?.name,
                        company.enrichment_data.locations.headquarters.country?.name
                      ].filter(Boolean).join(', ')}
                    </div>
                  </div>
                </div>
              )}

              {company.enrichment_data?.finances?.revenue && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Annual Revenue</div>
                    <div className="font-medium">{formatRevenue(company.enrichment_data.finances.revenue)}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        {company.domain && (
          <Button variant="outline" size="sm" asChild>
            <a href={`https://${company.domain}`} target="_blank" rel="noopener noreferrer">
              <Globe2 className="w-4 h-4" />
              Website
            </a>
          </Button>
        )}
        {company.linkedin_url && (
          <Button variant="outline" size="sm" asChild>
            <a href={company.linkedin_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
              LinkedIn
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
