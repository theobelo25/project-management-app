import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@web/components/ui/button';

type BackLinkProps = { href: string; children: React.ReactNode };

export function BackLink({ href, children }: BackLinkProps) {
  return (
    <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
      <Link href={href}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        {children}
      </Link>
    </Button>
  );
}
