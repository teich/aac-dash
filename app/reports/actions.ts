"use server";

import { getTopDroppers, getTopIncreases } from "@/app/lib/services/reportService";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updatePeriod(formData: FormData) {
  const period = formData.get("period");
  
  if (!period || typeof period !== "string") {
    throw new Error("Invalid period");
  }

  const periodValue = parseInt(period, 10);
  if (isNaN(periodValue) || periodValue < 1 || periodValue > 60) {
    throw new Error("Period must be between 1 and 60 months");
  }

  revalidatePath("/reports");
  redirect(`/reports?period=${periodValue}`);
}

export async function fetchReportData(periodMonths: number) {
  try {
    const [topDroppers, topIncreases] = await Promise.all([
      getTopDroppers(10, periodMonths),
      getTopIncreases(10, periodMonths)
    ]);

    return {
      topDroppers: topDroppers.map(d => ({
        ...d,
        percentage: d.dropPercentage
      })),
      topIncreases: topIncreases.map(i => ({
        ...i,
        percentage: i.increasePercentage
      }))
    };
  } catch (error) {
    console.error("Error fetching report data:", error);
    throw new Error("Failed to fetch report data");
  }
}
