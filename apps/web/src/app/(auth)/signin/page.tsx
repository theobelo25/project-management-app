import { PageLayout } from "@web/components/layout/page-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";
import SignInForm from "./signin-form";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Nudge account to manage your projects.",
};

export default function SignInPage() {
  return (
    <PageLayout variant="narrow">
      <Card>
        <CardHeader>
          <CardTitle>
            <h2>Sign In</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
    </PageLayout>
  );
}
