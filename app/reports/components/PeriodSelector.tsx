import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updatePeriod } from "../actions";

export function PeriodSelector({ defaultValue }: { defaultValue: number }) {
  return (
    <form 
      action={updatePeriod}
      className="flex items-center gap-2"
    >
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
          defaultValue={defaultValue}
          className="w-24"
        />
        <Button type="submit" size="sm">
          Update
        </Button>
      </div>
    </form>
  );
}
