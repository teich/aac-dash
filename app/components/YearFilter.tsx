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

// Generate years from current year back to 2010
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 2009 }, (_, i) => currentYear - i);

interface YearFilterProps {
  selectedYears: number[];
  onChange: (years: number[]) => void;
}

export function YearFilter({ selectedYears, onChange }: YearFilterProps) {
  const [open, setOpen] = React.useState(false);

  const handleChange = (newYears: number[]) => {
    onChange(newYears);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between text-left font-normal"
        >
          <div className="truncate">
            {selectedYears.length > 0 ? (
              <>
                <span className="mr-2">
                  {selectedYears.length} selected
                </span>
                <span className="text-muted-foreground">
                  ({selectedYears[0]}
                  {selectedYears.length > 1 ? " +" + (selectedYears.length - 1) : ""})
                </span>
              </>
            ) : (
              <span>Filter by year</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] min-w-[200px] p-0" align="start">
        <Command className="rounded-lg border shadow-md w-full">
          <CommandInput 
            placeholder="Search years..." 
            className="px-3 py-2.5 w-full"
          />
          <CommandList className="max-h-[300px] overflow-y-auto">
            <CommandEmpty>No year found.</CommandEmpty>
            <CommandGroup className="px-1.5 py-2">
              {YEARS.map((year) => (
                <CommandItem
                  key={year}
                  onSelect={() => {
                    const newYears = selectedYears.includes(year)
                      ? selectedYears.filter((y) => y !== year)
                      : [...selectedYears, year];
                    handleChange(newYears);
                  }}
                >
                  <div className="flex items-center flex-shrink-0 w-4 h-4 mr-2">
                    <Check
                      className={cn(
                        "w-4 h-4",
                        selectedYears.includes(year) ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </div>
                  {year}
                </CommandItem>
              ))}
            </CommandGroup>
            {selectedYears.length > 0 && (
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
