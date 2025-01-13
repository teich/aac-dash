'use client';

import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, UserSquare2, ShoppingCart } from "lucide-react";

interface Company {
  id: string;
  name: string;
  domain: string;
  primary_industry?: string;
  total_sales: number;
  total_people: number;
  total_orders: number;
}

interface CompaniesTableProps {
  companies: Company[];
}

export function CompaniesTable({ companies }: CompaniesTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Domain</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Total Sales
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <UserSquare2 className="h-4 w-4" />
                People
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Orders
              </div>
            </TableHead>
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