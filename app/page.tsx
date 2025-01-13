// app/page.tsx
import { Suspense } from 'react';
import { getCompaniesData } from './lib/actions';
import { CompanyCard } from './components/CompanyCard';
import Link from 'next/link';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

const CardSkeleton = () => (
  <div className="space-y-3">
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
  </div>
);

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const industry = typeof params.industry === 'string' ? params.industry : undefined;
  const includeConsumerSites = params.includeConsumer === 'true';
  const search = typeof params.search === 'string' ? params.search : undefined;
  const page = typeof params.page === 'string' ? parseInt(params.page) : 1;
  const pageSize = 12;

  const { companies, totalCount, totalPages } = await getCompaniesData(
    industry, 
    includeConsumerSites,
    search,
    page,
    pageSize
  );

  const buildUrl = (newParams: Record<string, string>) => {
    const currentParams = new URLSearchParams();
    if (industry) currentParams.set('industry', industry);
    if (includeConsumerSites) currentParams.set('includeConsumer', 'true');
    if (search) currentParams.set('search', search);
    if (page > 1) currentParams.set('page', page.toString());
    
    // Override with new params
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        currentParams.set(key, value);
      } else {
        currentParams.delete(key);
      }
    });
    
    return `?${currentParams.toString()}`;
  };

  return (
    <div className="container mx-auto p-6">
      <header className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
        
        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <form className="flex w-full sm:w-auto items-center gap-2">
            <div className="relative flex items-center w-[350px]">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                name="search"
                placeholder="Search companies..."
                defaultValue={search}
                className="pl-11 pr-8"
              />
              {search && (
                <Link
                  href={buildUrl({ search: '', page: '1' })}
                  className="absolute right-3 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Link>
              )}
            </div>
            <Button type="submit" variant="default">
              Search
            </Button>
          </form>

          <div className="flex items-center gap-2">
            {industry && (
              <Button 
                variant="outline" 
                asChild
              >
                <Link href={buildUrl({ industry: '' })}>
                  Clear industry filter
                </Link>
              </Button>
            )}
            <Button 
              variant="outline" 
              asChild
            >
              <Link href={buildUrl({ includeConsumer: (!includeConsumerSites).toString() })}>
                {includeConsumerSites ? 'Hide' : 'Show'} consumer sites
              </Link>
            </Button>
          </div>
        </div>

        {/* Results info */}
        <div className="text-sm text-muted-foreground">
          {search ? (
            <p>
              Found {totalCount} {totalCount === 1 ? 'company' : 'companies'} matching "{search}"
              {industry && ` in ${industry}`}
              {!includeConsumerSites && ' (excluding consumer sites)'}
            </p>
          ) : (
            <p>
              {industry 
                ? `Showing companies in ${industry}`
                : 'Showing top companies by sales'}
              {!includeConsumerSites && ' (excluding consumer sites)'}
            </p>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map(company => (
          <Suspense key={company.id} fallback={<CardSkeleton />}>
            <CompanyCard company={company} />
          </Suspense>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {page > 1 && (
            <Button 
              variant="outline" 
              asChild
            >
              <Link href={buildUrl({ page: (page - 1).toString() })}>
                Previous
              </Link>
            </Button>
          )}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === page ? "default" : "outline"}
                size="sm"
                asChild
              >
                <Link href={buildUrl({ page: pageNum.toString() })}>
                  {pageNum}
                </Link>
              </Button>
            ))}
          </div>
          {page < totalPages && (
            <Button 
              variant="outline" 
              asChild
            >
              <Link href={buildUrl({ page: (page + 1).toString() })}>
                Next
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
