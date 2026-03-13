import { PageLayout } from "@web/components/layout/page-layout";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";
import SignInForm from "./signin-form";

import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Nudge account to manage your projects.",
};

export default function SignInPage() {
  return (
    <PageLayout variant="narrow" centerVertical={true}>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>
              <h2>Sign In</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SignInForm />
          </CardContent>
          <CardFooter>
            Don't Have an account?&nbsp;&nbsp;
            <Link href={"/signup"}>Sign Up</Link>
            &nbsp;instead!
          </CardFooter>
        </Card>
      </div>
    </PageLayout>
  );
}
