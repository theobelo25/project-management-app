import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';

import { Button } from '@web/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@web/components/ui/card';

const meta = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Composition pattern used across project dashboards. This story mirrors how cards are built in the app (header + content + footer).',
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ProjectOverview: Story = {
  render: () => (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Website redesign</CardTitle>
        <CardDescription>
          Track milestones and team workload in one place.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground">
        <p>Next: finalize board columns and calendar filters.</p>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline" size="sm" type="button">
          View tasks
        </Button>
        <Button size="sm" type="button">
          Open project
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const Compact: Story = {
  render: () => (
    <Card size="sm" className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-sm">Sprint goal</CardTitle>
        <CardDescription>Ship portfolio-ready component tests.</CardDescription>
      </CardHeader>
    </Card>
  ),
};

/** Smoke test that the card title and body copy render predictably for snapshots and queries. */
export const HasDocumentedHeading: Story = {
  render: () => (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Standup notes</CardTitle>
        <CardDescription>Daily sync</CardDescription>
      </CardHeader>
      <CardContent>Review blockers before noon.</CardContent>
    </Card>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('Title and description are visible', async () => {
      await expect(
        canvas.getByRole('heading', { name: 'Standup notes', level: 3 }),
      ).toBeVisible();
      await expect(canvas.getByText('Daily sync')).toBeVisible();
    });
  },
};
