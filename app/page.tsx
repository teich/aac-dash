// app/page.tsx
import { Suspense } from 'react';
import { getCompaniesData } from './lib/actions';
import { CompanyCard } from './components/CompanyCard';
import { CompaniesTable } from './components/CompaniesTable';
import { CompanyFilters } from './components/CompanyFilters';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const params = await searchParams;
  const industry = typeof params.industry === 'string' ? params.industry : undefined;
  const includeConsumerSites = params.includeConsumer === 'true';
  const search = typeof params.search === 'string' ? params.search : undefined;
  const page = typeof params.page === 'string' ? parseInt(params.page) : 1;
  const viewMode = typeof params.view === 'string' ? (params.view as 'grid' | 'table') : 'grid';
  const sortField = typeof params.sort === 'string' ? params.sort : 'total_sales';
  const sortDirection = params.dir === 'asc' ? 'asc' : 'desc';
  const revenueRanges = typeof params.revenue === 'string' 
    ? params.revenue.split(',').map(range => decodeURIComponent(range))
    : [];
  const pageSize = 12;

  const { companies, totalCount, totalPages } = await getCompaniesData(
    industry, 
    includeConsumerSites,
    search,
    page,
    pageSize,
    sortField,
    sortDirection,
    revenueRanges
  );

  return (
    <div className="container mx-auto p-6">
      <header className="mb-8 space-y-4">
        <CompanyFilters
          search={search}
          industry={industry}
          includeConsumerSites={includeConsumerSites}
          viewMode={viewMode}
          revenueRanges={revenueRanges}
        />

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

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map(company => (
            <Suspense key={company.id} fallback={<CardSkeleton />}>
              <CompanyCard company={company} />
            </Suspense>
          ))}
        </div>
      ) : (
        <CompaniesTable 
          companies={companies} 
          sortField={sortField}
          sortDirection={sortDirection}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              {page > 1 && (
                <PaginationItem>
                  <PaginationPrevious href={`?${new URLSearchParams({ ...params, page: (page - 1).toString() })}`} />
                </PaginationItem>
              )}
              
              <PaginationItem>
                <PaginationLink 
                  href={`?${new URLSearchParams({ ...params, page: "1" })}`}
                  isActive={page === 1}
                >
                  1
                </PaginationLink>
              </PaginationItem>

              {page > 3 && <PaginationEllipsis />}

              {page !== 1 && page !== totalPages && (
                <PaginationItem>
                  <PaginationLink 
                    href={`?${new URLSearchParams({ ...params, page: page.toString() })}`}
                    isActive={true}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )}

              {page < totalPages - 2 && <PaginationEllipsis />}

              {totalPages !== 1 && (
                <PaginationItem>
                  <PaginationLink 
                    href={`?${new URLSearchParams({ ...params, page: totalPages.toString() })}`}
                    isActive={page === totalPages}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}

              {page < totalPages && (
                <PaginationItem>
                  <PaginationNext href={`?${new URLSearchParams({ ...params, page: (page + 1).toString() })}`} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
