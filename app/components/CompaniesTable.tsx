'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, UserSquare2, ShoppingCart, ArrowUpDown } from "lucide-react";

interface Company {
  id: string;
  name: string;
  domain: string;
  primary_industry?: string;
  total_sales: number;
  total_people: number;
  total_orders: number;
  revenue?: string;
}

interface CompaniesTableProps {
  companies: Company[];
  sortField: string;
  sortDirection: 'asc' | 'desc';
}

export function CompaniesTable({ companies, sortField, sortDirection }: CompaniesTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatRevenue = (revenue: string): string => {
    return revenue.replace(/-/g, ' to ').replace(/([mb])/g, ' $1illion');
  };

  const handleSort = (field: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    
    params.set('sort', field);
    params.set('dir', newDirection);
    
    router.push(`?${params.toString()}`);
  };

  const SortableHeader = ({ field, children }: { field: string, children: React.ReactNode }) => {
    const isActive = sortField === field;
    return (
      <TableHead 
        className="cursor-pointer hover:bg-muted/50"
        onClick={() => handleSort(field)}
      >
        <div className="flex items-center gap-2">
          {children}
          <ArrowUpDown className={`h-4 w-4 ${isActive ? 'opacity-100' : 'opacity-50'}`} />
        </div>
      </TableHead>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHeader field="name">Name</SortableHeader>
            <SortableHeader field="domain">Domain</SortableHeader>
            <TableHead>Industry</TableHead>
            <TableHead>Annual Revenue</TableHead>
            <SortableHeader field="total_sales">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Total Sales
              </div>
            </SortableHeader>
            <SortableHeader field="total_people">
              <div className="flex items-center gap-2">
                <UserSquare2 className="h-4 w-4" />
                People
              </div>
            </SortableHeader>
            <SortableHeader field="total_orders">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Orders
              </div>
            </SortableHeader>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell className="font-medium">
                <Link href={`/${company.domain}`} className="hover:underline">
                  {company.name}
                </Link>
              </TableCell>
              <TableCell>{company.domain}</TableCell>
              <TableCell>{company.primary_industry || 'N/A'}</TableCell>
              <TableCell>{company.revenue ? formatRevenue(company.revenue) : 'N/A'}</TableCell>
              <TableCell>{formatCurrency(company.total_sales)}</TableCell>
              <TableCell>{company.total_people.toLocaleString()}</TableCell>
              <TableCell>{company.total_orders.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 