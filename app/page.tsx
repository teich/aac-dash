// app/page.tsx
import { Suspense } from 'react';
import { getCompaniesData } from './lib/actions';
import { CompanyCard } from './components/CompanyCard';
import Link from 'next/link';

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
  const data = await getCompaniesData(industry);

  return (
    <div className="container mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
        <div className="flex items-center gap-2 mt-2">
          <p className="text-muted-foreground">
            {industry 
              ? `Showing companies in ${industry}`
              : 'Showing top companies by revenue'}
          </p>
          {industry && (
            <Link 
              href="/"
              className="text-sm text-primary hover:underline"
            >
              (Clear filter)
            </Link>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map(company => (
          <Suspense key={company.id} fallback={<CardSkeleton />}>
            <CompanyCard company={company} />
          </Suspense>
        ))}
      </div>
    </div>
  );
}
