'use client';

import { LayoutGrid, Table as TableIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ViewToggleProps {
  viewMode: 'grid' | 'table';
  onChange: (mode: 'grid' | 'table') => void;
}

export function ViewToggle({ viewMode, onChange }: ViewToggleProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => onChange(viewMode === 'grid' ? 'table' : 'grid')}
    >
      {viewMode === 'grid' ? (
        <TableIcon className="h-4 w-4" />
      ) : (
        <LayoutGrid className="h-4 w-4" />
      )}
    </Button>
  );
} 