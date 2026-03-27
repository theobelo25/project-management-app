import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@web/components/ui/card';
import type { ReactNode } from 'react';

type AuthCardProps = {
  /** Heading shown in the card (e.g. "Sign In" or "Sign Up") */
  title: string;
  /** The form or other main content */
  children: ReactNode;
  /** Footer content, e.g. prompt + Link to the other auth page */
  footer: ReactNode;
};

export function AuthCard({ title, children, footer }: AuthCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>{title}</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>{footer}</CardFooter>
    </Card>
  );
}
