import { PageLayout } from "@web/components/layout/page-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";
import SignUpForm from "./signup-form";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create a Nudge account to start tracking and managing your projects.",
};

export default function SignUpPage() {
  return (
    <PageLayout variant="narrow">
      <Card>
        <CardHeader>
          <CardTitle>
            <h2>Sign Up</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
      </Card>
    </PageLayout>
  );
}
