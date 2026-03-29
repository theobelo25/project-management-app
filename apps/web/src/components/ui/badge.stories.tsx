import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { AlertCircle, Check } from 'lucide-react';

import { Badge } from '@web/components/ui/badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Compact status labels. Assertions below focus on accessibility roles and visible text—good patterns for UI regression tests without heavy mocking.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'secondary',
        'destructive',
        'outline',
        'ghost',
        'link',
      ],
    },
  },
  args: {
    children: 'Badge',
    variant: 'default',
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Member' },
};

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Overdue' },
};

export const Outline: Story = {
  args: { variant: 'outline', children: 'Draft' },
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default" className="gap-1">
        <Check aria-hidden />
        Done
      </Badge>
      <Badge variant="destructive" className="gap-1">
        <AlertCircle aria-hidden />
        Blocked
      </Badge>
    </div>
  ),
};

/** Ensures badges remain discoverable as status text (screen readers + tests). */
export const AccessibleLabels: Story = {
  args: { children: 'In progress', variant: 'secondary' },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('Status text is exposed in the document', async () => {
      await expect(canvas.getByText('In progress')).toBeVisible();
    });
  },
};
