import Link from 'next/link';
import type { Metadata } from 'next';

import { ArrowRight, CheckCircle2, FolderKanban, Users } from 'lucide-react';
import { Button } from '@web/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@web/components/ui/card';
import { PageLayout } from '@web/components/layout/page-layout';
import { ROUTES } from '@web/lib/routes';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Planning makes perfect. Track your next project with ease using Nudge.',
};

const features = [
  {
    title: 'Organize projects clearly',
    description:
      'Create projects, keep work structured, and give every team a clear place to collaborate.',
    icon: FolderKanban,
  },
  {
    title: 'Track tasks with confidence',
    description:
      'Manage open work, monitor progress, and keep important tasks from slipping through the cracks.',
    icon: CheckCircle2,
  },
  {
    title: 'Built for team collaboration',
    description:
      'Support members, permissions, and shared visibility so everyone stays aligned.',
    icon: Users,
  },
];

export default function LandingPage() {
  return (
    <PageLayout>
      <section>
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-20 md:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full border bg-muted/40 px-3 py-1 text-sm text-muted-foreground">
              Project management for focused teams
            </div>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Plan projects, track tasks, and keep work moving.
              </h1>

              <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
                A clean workspace for managing projects, assigning tasks, and
                collaborating with your team without the clutter.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="gap-2">
                <Link href={ROUTES.signup}>
                  Start free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button asChild size="lg" variant="outline">
                <Link href={ROUTES.signin}>Go to dashboard</Link>
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border bg-card p-4">
                <p className="text-2xl font-semibold tracking-tight">
                  Projects
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Organize work by team or initiative
                </p>
              </div>

              <div className="rounded-xl border bg-card p-4">
                <p className="text-2xl font-semibold tracking-tight">Tasks</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Keep priorities visible and actionable
                </p>
              </div>

              <div className="rounded-xl border bg-card p-4">
                <p className="text-2xl font-semibold tracking-tight">Members</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Collaborate with shared visibility
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border bg-card p-4 shadow-sm md:p-6">
            <div className="rounded-2xl border bg-background p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Team Dashboard</p>
                  <p className="text-xs text-muted-foreground">
                    Projects, tasks, and progress at a glance
                  </p>
                </div>

                <div className="rounded-md border px-2 py-1 text-xs text-muted-foreground">
                  Live
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border p-4">
                    <p className="text-xs text-muted-foreground">Projects</p>
                    <p className="mt-2 text-2xl font-semibold">12</p>
                  </div>
                  <div className="rounded-xl border p-4">
                    <p className="text-xs text-muted-foreground">Open Tasks</p>
                    <p className="mt-2 text-2xl font-semibold">27</p>
                  </div>
                  <div className="rounded-xl border p-4">
                    <p className="text-xs text-muted-foreground">Completed</p>
                    <p className="mt-2 text-2xl font-semibold">89</p>
                  </div>
                </div>

                <div className="rounded-xl border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Website Redesign</p>
                      <p className="text-sm text-muted-foreground">
                        Marketing refresh and landing page updates
                      </p>
                    </div>

                    <div className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                      Owner
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">68%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div className="h-2 w-[68%] rounded-full bg-foreground" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        14 tasks • 9 completed
                      </span>
                      <span className="text-muted-foreground">
                        Updated 2h ago
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border p-4">
                  <p className="mb-3 font-medium">My Tasks</p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-lg border p-3 text-sm">
                      <span>Finalize project toolbar</span>
                      <span className="text-muted-foreground">In progress</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3 text-sm">
                      <span>Connect pagination to API</span>
                      <span className="text-muted-foreground">Todo</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3 text-sm">
                      <span>Build project details page</span>
                      <span className="text-muted-foreground">Todo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/20">
        <div className="mx-auto w-full max-w-7xl px-4 py-20 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              Everything your team needs to stay aligned
            </h2>
            <p className="mt-3 text-muted-foreground">
              Manage work with a simple, structured interface built for clarity
              instead of clutter.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <Card key={feature.title} className="rounded-2xl">
                  <CardHeader>
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border bg-background">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>

                  <CardContent />
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto w-full max-w-7xl px-4 py-20 md:px-6">
          <div className="rounded-3xl border bg-card px-6 py-12 text-center shadow-sm md:px-10">
            <h2 className="text-3xl font-semibold tracking-tight">
              Ready to get organized?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Start managing projects, tracking tasks, and collaborating with
              your team in one place.
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href={ROUTES.signup}>Create an account</Link>
              </Button>

              <Button asChild size="lg" variant="outline">
                <Link href={ROUTES.signin}>Sign in</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
