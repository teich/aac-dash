import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SpendingTable } from "./components/SpendingTable";
import { PeriodSelector } from "./components/PeriodSelector";
import { fetchReportData } from "./actions";
import { Suspense } from "react";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ReportsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const periodMonths = params.period ? Number(params.period) : 18;

  let reportData;
  try {
    reportData = await fetchReportData(periodMonths);
  } catch {
    return (
      <div className="w-[95%] mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Reports</h1>
          <PeriodSelector defaultValue={periodMonths} />
        </div>
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          Error loading report data. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="w-[95%] mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Reports</h1>
        <PeriodSelector defaultValue={periodMonths} />
      </div>
      
      <div className="w-full grid gap-6 grid-cols-1 md:grid-cols-2">
        <Suspense fallback={<CardSkeleton title="Loading droppers..." />}>
          <Card>
            <CardHeader>
              <CardTitle>Top Spending Droppers</CardTitle>
              <p className="text-sm text-muted-foreground">
                Customers with largest spending decrease (comparing last {periodMonths} months vs previous {periodMonths} months)
              </p>
            </CardHeader>
            <CardContent className="max-w-full">
              <SpendingTable 
                data={reportData.topDroppers}
                periodMonths={periodMonths}
                type="decrease"
              />
            </CardContent>
          </Card>
        </Suspense>

        <Suspense fallback={<CardSkeleton title="Loading increases..." />}>
          <Card>
            <CardHeader>
              <CardTitle>Top Spending Increase</CardTitle>
              <p className="text-sm text-muted-foreground">
                Customers with largest spending increase (comparing last {periodMonths} months vs previous {periodMonths} months)
              </p>
            </CardHeader>
            <CardContent className="max-w-full">
              <SpendingTable 
                data={reportData.topIncreases}
                periodMonths={periodMonths}
                type="increase"
              />
            </CardContent>
          </Card>
        </Suspense>
      </div>
    </div>
  );
}

function CardSkeleton({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={i}
              className="h-8 bg-muted rounded animate-pulse"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
