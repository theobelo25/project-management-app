'use client';

import { Search, X } from 'lucide-react';

import { Button } from '@web/components/ui/button';
import { Input } from '@web/components/ui/input';

type FilterToolbarProps = {
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  /** Left side: filters (e.g. Selects). */
  filters: React.ReactNode;
  /** Right side: sort Select + optional Clear button. */
  sortSlot: React.ReactNode;
  showClear: boolean;
  onClear?: () => void;
  /** Section layout: lg for projects, xl for tasks. */
  breakpoint?: 'lg' | 'xl';
};

export function FilterToolbar({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  filters,
  sortSlot,
  showClear,
  onClear,
  breakpoint = 'lg',
}: FilterToolbarProps) {
  const sectionClass =
    breakpoint === 'xl'
      ? 'flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between mb-4'
      : 'flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between mb-4';

  const filtersWrapperClass =
    breakpoint === 'xl'
      ? 'grid gap-3 sm:grid-cols-2 xl:flex xl:flex-1'
      : 'flex flex-1 flex-col gap-3 sm:flex-row';

  const searchWrapperClass =
    breakpoint === 'xl'
      ? 'relative w-full xl:max-w-sm'
      : 'relative w-full sm:max-w-sm';

  return (
    <section className={sectionClass}>
      <div className={filtersWrapperClass}>
        <div className={searchWrapperClass}>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9"
          />
        </div>
        {filters}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {sortSlot}
        {showClear && onClear ? (
          <Button
            type="button"
            variant="outline"
            onClick={onClear}
            className="w-full sm:w-auto"
          >
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        ) : null}
      </div>
    </section>
  );
}
