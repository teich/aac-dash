import { Suspense } from 'react';
import { getCompaniesData } from './lib/actions';
import { CompanyCard } from './components/CompanyCard';
import { CompaniesTable } from './components/CompaniesTable';
import { CompanyFilters } from './components/CompanyFilters';
import { CompanyPagination } from './components/CompanyPagination';
import { CompanyCardSkeleton } from './components/CompanyCardSkeleton';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CompaniesPage({ searchParams }: PageProps) {
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
  const years = typeof params.years === 'string'
    ? params.years.split(',').map(year => parseInt(year))
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
    revenueRanges,
    years
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
          years={years}
        />

        {/* Results info */}
        <div className="text-sm text-muted-foreground">
          {search ? (
            <p>
              Found {totalCount} {totalCount === 1 ? 'company' : 'companies'} matching &quot;{search}&quot;
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
            <Suspense key={company.id} fallback={<CompanyCardSkeleton />}>
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

      <CompanyPagination 
        currentPage={page}
        totalPages={totalPages}
        params={params}
      />
    </div>
  );
}
