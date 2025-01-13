'use client';

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

const REVENUE_RANGES = [
  { value: "under-1m", label: "Under $1M" },
  { value: "1m-10m", label: "$1M to $10M" },
  { value: "10m-50m", label: "$10M to $50M" },
  { value: "50m-100m", label: "$50M to $100M" },
  { value: "100m-200m", label: "$100M to $200M" },
  { value: "200m-1b", label: "$200M to $1B" },
  { value: "over-1b", label: "Over $1B" }
] as const;

interface RevenueFilterProps {
  selectedRanges: string[];
  onChange: (ranges: string[]) => void;
}

export function RevenueFilter({ selectedRanges, onChange }: RevenueFilterProps) {
  const [open, setOpen] = React.useState(false);

  const handleChange = (newRanges: string[]) => {
    onChange(newRanges);
  };

  const formatRevenue = (revenue: string): string => {
    const range = REVENUE_RANGES.find(r => r.value === revenue);
    return range?.label || revenue;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[280px] justify-between text-left font-normal"
        >
          <div className="truncate">
            {selectedRanges.length > 0 ? (
              <>
                <span className="mr-2">
                  {selectedRanges.length} selected
                </span>
                <span className="text-muted-foreground">
                  ({formatRevenue(selectedRanges[0])}
                  {selectedRanges.length > 1 ? " +" + (selectedRanges.length - 1) : ""})
                </span>
              </>
            ) : (
              <span>Filter by revenue</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] min-w-[280px] p-0" align="start">
        <Command className="rounded-lg border shadow-md w-full">
          <CommandInput 
            placeholder="Search revenue ranges..." 
            className="px-3 py-2.5 w-full"
          />
          <CommandList className="max-h-[300px] overflow-y-auto">
            <CommandEmpty>No revenue range found.</CommandEmpty>
            <CommandGroup className="px-1.5 py-2">
              {REVENUE_RANGES.map((range) => (
                <CommandItem
                  key={range.value}
                  onSelect={() => {
                    const newRanges = selectedRanges.includes(range.value)
                      ? selectedRanges.filter((r) => r !== range.value)
                      : [...selectedRanges, range.value];
                    handleChange(newRanges);
                  }}
                >
                  <div className="flex items-center flex-shrink-0 w-4 h-4 mr-2">
                    <Check
                      className={cn(
                        "w-4 h-4",
                        selectedRanges.includes(range.value) ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </div>
                  {range.label}
                </CommandItem>
              ))}
            </CommandGroup>
            {selectedRanges.length > 0 && (
              <>
                <Separator />
                <CommandGroup className="p-1.5">
                  <CommandItem
                    onSelect={() => handleChange([])}
                    className="justify-center text-sm text-muted-foreground hover:text-foreground hover:bg-secondary"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
