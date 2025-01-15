"use server";

import { CompanyService } from "./services/companyService";
import type { GetCompaniesOptions } from "./types";

export async function getCompaniesData(
  industry?: string,
  includeConsumerSites: boolean = false,
  search?: string,
  page: number = 1,
  pageSize: number = 12,
  sortField: string = "total_sales",
  sortDirection: "asc" | "desc" = "desc",
  revenueRanges: string[] = [],
  years: number[] = [],
) {
  const options: GetCompaniesOptions = {
    industry,
    includeConsumerSites,
    search,
    page,
    pageSize,
    sortField,
    sortDirection,
    revenueRanges,
    years,
  };

  return CompanyService.getCompanies(options);
}

export async function getCompanyByDomain(domain: string) {
  return CompanyService.getCompanyByDomain(domain);
}
