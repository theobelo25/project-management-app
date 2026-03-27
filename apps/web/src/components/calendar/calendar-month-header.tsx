'use client';

import { CardHeader, CardTitle } from '@web/components/ui/card';
import { Button } from '@web/components/ui/button';

type CalendarMonthHeaderProps = {
  monthLabel: string;
  onPrev?: () => void;
  onNext?: () => void;
};

export function CalendarMonthHeader({
  monthLabel,
  onPrev,
  onNext,
}: CalendarMonthHeaderProps) {
  return (
    <CardHeader className="flex flex-row items-center justify-between space-y-0">
      <CardTitle>{monthLabel}</CardTitle>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onPrev} type="button">
          Prev
        </Button>
        <Button variant="outline" size="sm" onClick={onNext} type="button">
          Next
        </Button>
      </div>
    </CardHeader>
  );
}
