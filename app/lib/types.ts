export interface EnrichmentData {
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
  assets?: {
    logoSquare?: {
      src?: string;
    };
  };
}

export interface Company {
  id: string;
  name: string;
  company_name?: string;
  domain: string;
  linkedin_url: string | null;
  enrichment_data: EnrichmentData;
  logo_square?: string;
  total_people: number;
  total_sales: number;
  total_orders: number;
  revenue?: string;
  employees?: string;
  primary_industry?: string;
  all_industries?: string[];
  year_founded?: string;
  description?: string;
  monthly_visitors?: string;
  country?: string;
  city?: string;
  state?: string;
}

export interface LineItem {
  product_name: string;
  quantity: number;
  unit_price: string;
  amount: string;
}

export interface Order {
  invoice_number: string;
  date: string;
  amount: string;
  person_name: string;
  line_items: LineItem[];
}

export interface CompanyData extends Company {
  orders: Order[];
}

export interface GetCompaniesOptions {
  industry?: string;
  includeConsumerSites?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  revenueRanges?: string[];
}

export interface CompaniesResponse {
  companies: Company[];
  totalCount: number;
  totalPages: number;
}
