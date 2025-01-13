// app/components/CompanyCard.tsx
"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Users,
  Globe2,
  MapPin,
  Calendar,
  ExternalLink,
  DollarSign,
  UserSquare2,
  ShoppingCart,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Company {
  name: string;
  domain?: string;
  revenue?: string;
  total_sales: number;
  total_people: number;
  total_orders: number;
  primary_industry?: string;
  all_industries?: string[];
  employees?: string;
  city?: string;
  state?: string;
  country?: string;
  year_founded?: string;
  monthly_visitors?: string;
  description?: string;
  linkedin_url?: string;
  logo_square?: string;
}

export function CompanyCard({ company }: { company: Company }) {
  const router = useRouter();

  const getLocationString = () => {
    const parts = [company.city, company.state, company.country]
      .filter(Boolean)
      .join(", ");
    return parts || "Location not available";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get initials for the avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Format industry name for display
  const formatIndustry = (industry: string) => {
    return industry
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get secondary industries (excluding the primary one)
  const getSecondaryIndustries = () => {
    if (!company.all_industries) return [];
    const industries = company.all_industries.filter(
      (industry: string) => industry !== company.primary_industry,
    );
    // Return up to 4 additional industries
    return industries.slice(0, 4);
  };

  const handleIndustryClick = (e: React.MouseEvent, industry: string | undefined) => {
    e.preventDefault();
    if (industry) {
      router.push(`/?industry=${encodeURIComponent(industry)}`);
    }
  };

  return (
    <Link href={`/${company.domain}`} className="block">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <div className="flex gap-3 items-center">
              <Avatar className="h-12 w-12">
                {company.logo_square && (
                  <AvatarImage src={company.logo_square} alt={`${company.name} logo`} />
                )}
                <AvatarFallback className="bg-primary/10">
                  {getInitials(company.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl font-bold">
                  {company.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {company.domain}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs whitespace-nowrap">
              {company.revenue}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sales Statistics */}
          <div className="grid grid-cols-3 gap-4 py-4 border rounded-lg bg-muted/50">
            <div className="text-center space-y-1">
              <DollarSign className="w-4 h-4 mx-auto text-muted-foreground" />
              <p className="text-sm font-medium">
                {formatCurrency(company.total_sales)}
              </p>
              <p className="text-xs text-muted-foreground">Total Sales</p>
            </div>
            <div className="text-center space-y-1 border-x">
              <UserSquare2 className="w-4 h-4 mx-auto text-muted-foreground" />
              <p className="text-sm font-medium">{company.total_people}</p>
              <p className="text-xs text-muted-foreground">People</p>
            </div>
            <div className="text-center space-y-1">
              <ShoppingCart className="w-4 h-4 mx-auto text-muted-foreground" />
              <p className="text-sm font-medium">{company.total_orders}</p>
              <p className="text-xs text-muted-foreground">Orders</p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Industry Tags */}
            {company.primary_industry && (
              <div className="flex items-start gap-2 text-sm">
                <Building2 className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <button
                    type="button"
                    onClick={(e) => handleIndustryClick(e, company.primary_industry)}
                    className="font-medium hover:underline"
                  >
                    {formatIndustry(company.primary_industry)}
                  </button>
                  {getSecondaryIndustries().length > 0 && (
                    <span className="text-muted-foreground">
                      {", "}
                      {getSecondaryIndustries().map((industry, index) => (
                        <span key={industry}>
                          <button
                            type="button"
                            onClick={(e) => handleIndustryClick(e, industry)}
                            className="hover:underline"
                          >
                            {formatIndustry(industry)}
                          </button>
                          {index < getSecondaryIndustries().length - 1 && ", "}
                        </span>
                      ))}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span>{company.employees || "Team size not specified"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{getLocationString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>Founded {company.year_founded || "Year not available"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Globe2 className="w-4 h-4 text-muted-foreground" />
              <span>
                {company.monthly_visitors || "Visitor data not available"}
              </span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-3">
            {company.description || "No description available"}
          </p>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {company.domain && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                window.open(`https://${company.domain}`, "_blank");
              }}
            >
              <Globe2 className="w-4 h-4 mr-2" />
              Website
            </Button>
          )}
          {company.linkedin_url && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                window.open(company.linkedin_url, "_blank");
              }}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              LinkedIn
            </Button>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
