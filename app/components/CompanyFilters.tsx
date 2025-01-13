'use client';

import Link from 'next/link';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { ViewToggle } from './ViewToggle';
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';

interface CompanyFiltersProps {
  search?: string;
  industry?: string;
  includeConsumerSites: boolean;
  viewMode: 'grid' | 'table';
}

export function CompanyFilters({ 
  search, 
  industry, 
  includeConsumerSites, 
  viewMode,
}: CompanyFiltersProps) {
  const router = useRouter();

  const buildUrl = (newParams: Record<string, string>) => {
    const currentParams = new URLSearchParams();
    if (industry) currentParams.set('industry', industry);
    if (includeConsumerSites) currentParams.set('includeConsumer', 'true');
    if (search) currentParams.set('search', search);
    if (viewMode !== 'grid') currentParams.set('view', viewMode);
    
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

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get('search') as string;
    router.push(buildUrl({ 
      search: searchValue,
      page: '1',
      view: viewMode // Preserve the current view mode
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
        <ViewToggle 
          viewMode={viewMode} 
          onChange={(mode) => {
            window.location.href = buildUrl({ view: mode });
          }} 
        />
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <form onSubmit={handleSearch} className="flex w-full sm:w-auto items-center gap-2">
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
    </div>
  );
} 