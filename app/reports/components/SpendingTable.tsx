import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface SpendingData {
  companyId: number;
  companyName: string;
  companyDomain: string;
  recentSpending: number;
  previousSpending: number;
  percentage: number;
}

interface SpendingTableProps {
  data: SpendingData[];
  periodMonths: number;
  type: 'increase' | 'decrease';
}

export function SpendingTable({ data, periodMonths, type }: SpendingTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Company</TableHead>
          <TableHead className="text-right">
            {type === 'increase' ? 'Increase' : 'Drop'}
          </TableHead>
          <TableHead className="text-right">Previous {periodMonths}mo</TableHead>
          <TableHead className="text-right">Recent {periodMonths}mo</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.companyId}>
            <TableCell>
              <Link 
                href={`/company/${item.companyDomain}`}
                className="text-muted-foreground hover:underline"
              >
                {item.companyName}
              </Link>
            </TableCell>
            <TableCell className="text-right">
              <span className={`font-bold ${
                type === 'increase' 
                  ? 'text-green-600' 
                  : 'text-destructive'
              }`}>
                {type === 'increase' ? '+' : ''}{item.percentage}%
              </span>
            </TableCell>
            <TableCell className="text-right font-medium">
              {formatCurrency(item.previousSpending)}
            </TableCell>
            <TableCell className="text-right font-medium">
              {formatCurrency(item.recentSpending)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
