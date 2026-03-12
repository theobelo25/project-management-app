import { PageLayout } from "@web/components/layout/page-layout";
import { Button } from "@web/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Planning makes perfect. Track your next project with ease using Nudge.",
};

export default function Home() {
  return (
    <PageLayout>
      <section id="hero-section">
        <h2>Planning makes perfect!</h2>
        <p>Track your next project with ease.</p>
        <Button asChild>
          <Link href={"/signup"}>Get Started!</Link>
        </Button>
      </section>
    </PageLayout>
  );
}
