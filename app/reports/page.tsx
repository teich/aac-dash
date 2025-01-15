import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getTopDroppers, getTopIncreases } from "../lib/services/reportService";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const period = await Promise.resolve(searchParams.period);
  const periodMonths = Number(period) || 18;
  const topDroppers = await getTopDroppers(5, periodMonths);
  const topIncreases = await getTopIncreases(5, periodMonths);

  return (
    <div className="container mx-auto py-8">
      <form 
        className="flex justify-between items-center mb-8"
        action={`/reports`}
      >
        <h1 className="text-3xl font-bold">Reports</h1>
        <div className="flex items-center gap-2">
          <label htmlFor="period" className="text-sm text-muted-foreground">
            Period Length (months):
          </label>
          <div className="flex items-center gap-2">
            <Input
              id="period"
              name="period"
              type="number"
              min="1"
              max="60"
              defaultValue={periodMonths}
              className="w-24"
            />
            <Button type="submit" size="sm">
              Update
            </Button>
          </div>
        </div>
      </form>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Top Spending Droppers</CardTitle>
            <p className="text-sm text-muted-foreground">
              Customers with largest spending decrease (comparing last {periodMonths} months vs previous {periodMonths} months)
            </p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead className="text-right">Drop</TableHead>
              <TableHead className="text-right">Previous {periodMonths}mo</TableHead>
              <TableHead className="text-right">Recent {periodMonths}mo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topDroppers.map((dropper) => (
                  <TableRow key={dropper.companyId}>
                    <TableCell>
                      <Link 
                        href={`/company/${dropper.companyDomain}`}
                        className="text-muted-foreground hover:underline"
                      >
                        {dropper.companyName}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-bold text-destructive">
                        {dropper.dropPercentage}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(dropper.previousSpending)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(dropper.recentSpending)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Top Spending Increase</CardTitle>
            <p className="text-sm text-muted-foreground">
              Customers with largest spending increase (comparing last {periodMonths} months vs previous {periodMonths} months)
            </p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead className="text-right">Increase</TableHead>
              <TableHead className="text-right">Previous {periodMonths}mo</TableHead>
              <TableHead className="text-right">Recent {periodMonths}mo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topIncreases.map((increase) => (
                  <TableRow key={increase.companyId}>
                    <TableCell>
                      <Link 
                        href={`/company/${increase.companyDomain}`}
                        className="text-muted-foreground hover:underline"
                      >
                        {increase.companyName}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-bold text-green-600">
                        +{increase.increasePercentage}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(increase.previousSpending)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(increase.recentSpending)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
